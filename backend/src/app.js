// all module we use commonJS  const func = require('file path') and we dont have to put file ext too
const express = require('express');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./config/swagger');
const errorMiddleware = require('./middlewares/error.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');

// Routes
const authRoutes    = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const stockRoutes   = require('./routes/stock.routes');
const shopRoutes    = require('./routes/shop.routes');
const reportRoutes  = require('./routes/report.routes');
const userRoutes    = require('./routes/user.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock',    stockRoutes);
app.use('/api/shops',    shopRoutes);
app.use('/api/reports',  reportRoutes);
app.use('/api/users',    userRoutes);

// Error handler
app.use(errorMiddleware);

module.exports = app;
