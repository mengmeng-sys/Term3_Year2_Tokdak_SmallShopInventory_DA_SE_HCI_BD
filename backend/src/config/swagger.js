const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TOKDAK API',
            version: '1.0.0',
            description: 'Small Shop Stock Inventory System API'
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:5000'
            }
        ],
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User management endpoints' },
            { name: 'Products', description: 'Product management endpoints' },
            { name: 'Categories', description: 'Category management endpoints' },
            { name: 'Shops', description: 'Shop management endpoints' },
            { name: 'Stock', description: 'Stock transaction endpoints' },
            { name: 'Reports', description: 'Report and analytics endpoints' },
            { name: 'Dashboard', description: 'Dashboard data endpoints' },
            { name: 'Alerts', description: 'Alert and notification endpoints' },
            { name: 'Backups', description: 'Backup management endpoints' },
            { name: 'Shop Settings', description: 'Shop settings endpoints' },
            { name: 'Activities', description: 'Activity log endpoints' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['admin', 'client'] },
                        shop_id: { type: 'integer', nullable: true },
                        avatar: { type: 'string', nullable: true },
                        status: { type: 'string', enum: ['active', 'inactive'] },
                        DOB: { type: 'string', format: 'date', nullable: true },
                        gender: { type: 'string', enum: ['Male', 'Female', 'Other'], nullable: true },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        price: { type: 'number' },
                        cost_price: { type: 'number', nullable: true },
                        current_quantity: { type: 'integer' },
                        min_quantity: { type: 'integer' },
                        unit: { type: 'string' },
                        category_id: { type: 'integer', nullable: true },
                        shop_id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        shop_id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                Shop: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        shop_name: { type: 'string' },
                        address: { type: 'string', nullable: true },
                        phone: { type: 'string', nullable: true },
                        user_id: { type: 'integer' },
                        logo: { type: 'string', nullable: true },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                StockTransaction: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        product_id: { type: 'integer' },
                        type: { type: 'string', enum: ['restock', 'sale'] },
                        quantity: { type: 'integer' },
                        note: { type: 'string', nullable: true },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Alert: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        product_id: { type: 'integer', nullable: true },
                        type: { type: 'string' },
                        message: { type: 'string' },
                        resolved: { type: 'boolean' },
                        shop_id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                Backup: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        file_name: { type: 'string' },
                        file_size: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                ShopSettings: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        shop_id: { type: 'integer' },
                        low_stock_threshold: { type: 'integer' },
                        currency: { type: 'string' },
                        tax_rate: { type: 'number' }
                    }
                },
                Activity: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        user_id: { type: 'integer' },
                        action: { type: 'string' },
                        description: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' }
                    }
                },
                RegisterInput: {
                    type: 'object',
                    required: ['name', 'email', 'password', 'shop_name'],
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' },
                        DOB: { type: 'string', format: 'date' },
                        gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
                        shop_name: { type: 'string' },
                        address: { type: 'string' },
                        phone: { type: 'string' }
                    }
                },
                ProductInput: {
                    type: 'object',
                    required: ['name', 'price', 'current_quantity', 'min_quantity', 'unit'],
                    properties: {
                        name: { type: 'string' },
                        price: { type: 'number' },
                        current_quantity: { type: 'integer' },
                        min_quantity: { type: 'integer' },
                        unit: { type: 'string' },
                        category_id: { type: 'integer' }
                    }
                },
                CategoryInput: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string' }
                    }
                },
                ShopInput: {
                    type: 'object',
                    properties: {
                        shop_name: { type: 'string' },
                        address: { type: 'string' },
                        phone: { type: 'string' }
                    }
                },
                StockInput: {
                    type: 'object',
                    required: ['product_id', 'quantity'],
                    properties: {
                        product_id: { type: 'integer' },
                        quantity: { type: 'integer' },
                        note: { type: 'string' }
                    }
                },
                ChangePasswordInput: {
                    type: 'object',
                    required: ['oldPassword', 'newPassword', 'confirmPassword'],
                    properties: {
                        oldPassword: { type: 'string', format: 'password' },
                        newPassword: { type: 'string', format: 'password' },
                        confirmPassword: { type: 'string', format: 'password' }
                    }
                },
                UserUpdateInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        DOB: { type: 'string', format: 'date' },
                        gender: { type: 'string', enum: ['Male', 'Female', 'Other'] }
                    }
                },
                StatusToggleInput: {
                    type: 'object',
                    required: ['is_active'],
                    properties: {
                        is_active: { type: 'boolean' }
                    }
                },
                VerifyOtpInput: {
                    type: 'object',
                    required: ['email', 'otp'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        otp: { type: 'string' }
                    }
                },
                ForgotPasswordInput: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string', format: 'email' }
                    }
                },
                ResetPasswordInput: {
                    type: 'object',
                    required: ['email', 'otp', 'newPassword', 'confirmPassword'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        otp: { type: 'string' },
                        newPassword: { type: 'string', format: 'password' },
                        confirmPassword: { type: 'string', format: 'password' }
                    }
                },
                BackupInput: {
                    type: 'object',
                    properties: {
                        file_name: { type: 'string' },
                        file_size: { type: 'integer' }
                    }
                },
                SettingsInput: {
                    type: 'object',
                    properties: {
                        low_stock_threshold: { type: 'integer' },
                        currency: { type: 'string' },
                        tax_rate: { type: 'number' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                token: { type: 'string' },
                                user: { '$ref': '#/components/schemas/User' }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};
