import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from '../backend/middleware/errorMIddleware.js'

const port = process.env.PORT || 5000
dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.get('/api/config/paypal', (req, res) =>
	res.send({
		clientId: process.env.PAYPAL_CLIENT_ID,
	})
)

if (process.env.NODE_ENV === 'production') {
	const __dirname = path.resolve()
	app.use('/uploads', express.static('/var/data/uploads'))
	app.use(express.static(path.join(__dirname, '/frontend/build')))
	app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
	const __dirname = path.resolve()
	app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
	app.get('/', (req, res) => {
		res.send('API is running....')
	})
}

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})
