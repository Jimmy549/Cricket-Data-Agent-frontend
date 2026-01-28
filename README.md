# Cricket Data Agent Frontend

A modern Next.js frontend for the Cricket Data Agent, providing an intuitive chat interface for cricket data analysis powered by AI.

## 🚀 Features

- **Chat Interface**: Clean, responsive chat UI for natural language queries
- **Real-time Responses**: Instant AI-powered cricket data analysis
- **Table Display**: Structured data presentation for complex queries
- **Dark/Light Mode**: Automatic theme detection
- **Responsive Design**: Works on desktop, tablet, and mobile
- **TypeScript**: Full type safety and better developer experience

## 📋 Prerequisites

- Node.js 18+
- Backend service running on port 3001

## 🛠️ Installation

1. **Navigate to frontend:**
   ```bash
   cd Cricket-Data-Agent-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

## 🏃♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Basic Queries
- "Who has the most runs in Test cricket?"
- "Show me top 10 ODI batsmen by average"
- "Compare Virat Kohli and Steve Smith in T20s"

### Advanced Queries
- "Which country has the most centuries in Test cricket?"
- "Show players with strike rate above 150 in T20s"
- "List all players from Australia with more than 5000 runs"

### Response Types
- **Text Responses**: Simple answers and explanations
- **Table Responses**: Structured data with player statistics
- **Error Messages**: Clear feedback for invalid queries

## 🧩 Components

### ChatInterface
Main chat component handling:
- Message input and submission
- Response display
- Loading states
- Error handling

### MessageBubble
Individual message component with:
- User/AI message styling
- Table data rendering
- Timestamp display
- Copy functionality

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/
│   ├── ChatInterface.tsx  # Main chat component
│   └── MessageBubble.tsx  # Message display component
└── types/             # TypeScript type definitions
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Automatic system preference detection
- **Custom Components**: Reusable UI elements

## 🔌 API Integration

### Backend Communication
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cricket/ask`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ question }),
});
```

### Response Handling
- Success responses with data/tables
- Error responses with user-friendly messages
- Loading states during API calls
- Retry logic for failed requests

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Features
- Collapsible sidebar on mobile
- Optimized touch targets
- Readable typography at all sizes
- Efficient use of screen space

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (required)

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  // Additional optimizations
}
```

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running on port 3001
   - Check NEXT_PUBLIC_API_URL in .env.local
   - Ensure CORS is properly configured

2. **Build Errors**
   - Clear .next folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

3. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check for conflicting CSS rules
   - Clear browser cache

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 🎯 Performance Optimization

- **Next.js Optimizations**: Automatic code splitting and optimization
- **Image Optimization**: Built-in Next.js image optimization
- **Bundle Analysis**: Analyze bundle size with `npm run analyze`
- **Caching**: Efficient API response caching

## 🔒 Security

- **Environment Variables**: Sensitive data in .env.local
- **XSS Protection**: React's built-in XSS protection
- **HTTPS**: Enforce HTTPS in production
- **Content Security Policy**: Configured for production

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include error messages and steps to reproduce