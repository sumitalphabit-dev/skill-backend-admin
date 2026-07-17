const { google } = require('googleapis');
const AppError = require('../utils/AppError');

// In-memory mock database for testing/mock mode
let mockDatabase = [];

// Helper to get Google Sheets client
const getSheetsClient = () => {
    if (process.env.USE_MOCK_SHEETS === 'true') {
        return {
            spreadsheets: {
                values: {
                    append: async ({ resource }) => {
                        const row = resource.values[0];
                        mockDatabase.push(row);
                        const rowIndex = mockDatabase.length + 1; // row 2 is index 0
                        return {
                            data: {
                                updates: {
                                    updatedRange: `Sheet1!A${rowIndex}:G${rowIndex}`
                                }
                            }
                        };
                    }
                }
            }
        };
    }

    const clientEmail = process.env.GOOGLE_SHEET_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_SHEET_PRIVATE_KEY;
    
    if (!clientEmail || !privateKey) {
        throw new AppError('Google Sheets credentials are not fully configured in environment variables.', 500);
    }
    
    // Strip surrounding quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    
    // Replace literal '\n' characters with actual newline characters if pasted as a single-line string
    privateKey = privateKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return google.sheets({ version: 'v4', auth });
};

const createInquiry = async (inquiryData) => {
    const spreadsheetId = process.env.GOOGLE_SHEET_SPREADSHEET_ID;
    if (!spreadsheetId) {
        throw new AppError('Google Sheet Spreadsheet ID is not configured.', 500);
    }

    try {
        const sheets = getSheetsClient();
        
        // Append row: [Date, Name, Email, Contact Number, Skill, Status, Notes]
        const rowValues = [
            new Date().toISOString(),
            inquiryData.name,
            inquiryData.email,
            inquiryData.contactNumber,
            inquiryData.skill,
            'pending', // Default status
            inquiryData.notes || ''
        ];

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:G', // Appends to the first sheet (assumes name 'Sheet1' or standard sheet structure)
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [rowValues]
            }
        });

        // The response contains the updated range. Let's find what row was updated.
        // E.g., 'Sheet1!A12:G12' -> 12
        const updatedRange = response.data.updates.updatedRange;
        const match = updatedRange.match(/A(\d+)/);
        const rowIndex = match ? parseInt(match[1], 10) : null;

        return {
            id: rowIndex,
            ...inquiryData,
            status: 'pending',
            createdAt: rowValues[0]
        };
    } catch (error) {
        console.error('Google Sheets API Error:', error);
        throw new AppError('Failed to save data to Google Sheet. ' + error.message, 502);
    }
};

module.exports = {
    createInquiry
};
