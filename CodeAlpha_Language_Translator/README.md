# CodeAlpha Language Translator

A modern, AI-powered language translator built with Next.js and Google Gemini API. Features a clean, professional interface with dark mode support, text-to-speech, and smooth animations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)

## Features

- 🌐 **13 Languages Supported**: English, Hindi, Urdu, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Chinese, Korean, Arabic
- 🔊 **Text-to-Speech**: Listen to translations with browser-native TTS (works in Chrome and Edge)
- 📋 **Copy to Clipboard**: One-click copy of translated text
- 🎨 **Modern UI**: Rounded corners, smooth hover animations, professional clean layout
- 🌓 **Dark Mode**: Full dark mode support with system preference detection
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- 🔒 **Secure**: API key stored server-side, never exposed to frontend
- ⚡ **Fast**: Built with Next.js 15 and optimized for performance
- 🚀 **Production Ready**: Vercel-compatible and ready to deploy

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (gemini-2.5-flash)
- **TTS**: Browser Web Speech API (speechSynthesis)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CodeAlpha_Language_Translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   **Get your API key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate a free API key.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Select Languages**: Choose source and target languages from the dropdown menus
2. **Enter Text**: Type or paste text in the input area
3. **Translate**: Click the "Translate" button
4. **View Result**: See the translation appear below
5. **Listen**: Click the speaker button (🔊) to hear the translation
6. **Copy**: Click the copy button (📋) to copy translation to clipboard
7. **Swap**: Use the swap button (⇄) to quickly reverse languages
8. **Dark Mode**: Toggle dark mode with the moon/sun icon

## Project Structure

```
CodeAlpha_Language_Translator/
├── app/
│   ├── api/
│   │   └── translate/
│   │       └── route.ts          # Secure API route for translation
│   ├── globals.css               # Global styles and CSS variables
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main translator component
├── .env                          # Environment variables (create this)
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## How It Works

### Translation Flow
1. **Frontend** (`app/page.tsx`): User enters text and selects languages
2. **API Route** (`app/api/translate/route.ts`): Receives request, calls Gemini API securely
3. **Gemini AI**: Translates text using gemini-2.5-flash model
4. **Response**: Returns only the translated text to the frontend

### Text-to-Speech
- Uses browser's native Web Speech API (`speechSynthesis`)
- No API calls - completely client-side
- Automatically selects appropriate voice for target language
- Works in Chrome, Edge, and other modern browsers

### Security
- ✅ API key stored in `.env` (never committed to git)
- ✅ Translation happens server-side via API route
- ✅ No API key exposure in frontend code
- ✅ Environment variables validated before use
- ✅ TTS runs entirely in browser (no data sent to servers)

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
5. Deploy!

Vercel will automatically detect Next.js and configure everything.

### Other Platforms

This app works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

Just make sure to set the `GEMINI_API_KEY` environment variable.

## Customization

### Adding More Languages

Edit the `languages` array in `app/page.tsx`:

```typescript
const languages = [
  "English",
  "Spanish",
  // Add more languages here
  "Your Language",
];
```

Also add the language code for TTS support:

```typescript
const languageCodes: { [key: string]: string } = {
  English: "en-US",
  "Your Language": "xx-XX",  // Add language code
};
```

### Changing Colors

Modify CSS variables in `app/globals.css`:

```css
:root {
  --button-bg: #2563eb;      /* Button color */
  --button-hover: #1d4ed8;   /* Button hover color */
  --card-bg: #ffffff;        /* Card background */
}
```

### Adjusting Translation Prompt

Edit the prompt in `app/api/translate/route.ts`:

```typescript
const prompt = `Translate from ${sourceLang} to ${targetLang}. Return only translated text without explanations.\n\n${text}`;
```

### Changing AI Model

Update the model in `app/api/translate/route.ts`:

```typescript
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

Available models: `gemini-2.5-flash`, `gemini-2.5-pro`

## Troubleshooting

### "API key not configured" error
- Make sure `.env` exists in the root directory
- Verify it contains `GEMINI_API_KEY=your_key_here`
- Restart the development server after adding the API key
- On Windows, ensure no system environment variable is overriding it

### Translation fails with quota error
- Check your API key quota at [Google AI Studio](https://aistudio.google.com/)
- Free tier has daily limits (typically resets every 24 hours)
- Consider upgrading to paid tier for higher limits

### Text-to-Speech not working
- **Chrome**: Should work out of the box
- **Edge**: Make sure you're using the latest version
- **Firefox/Safari**: May have limited voice support
- Check browser console for errors (F12 → Console tab)

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Run `npm run build` to check for build errors
- Verify Tailwind CSS is properly configured

### Port 3000 already in use
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node

# Then restart
npm run dev
```

## API Rate Limits

**Free Tier (Gemini API)**:
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per day

If you exceed limits, wait for the quota to reset or upgrade to a paid plan.

## Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Translation | ✅ | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ | ✅ |
| Copy to Clipboard | ✅ | ✅ | ✅ | ✅ |
| Text-to-Speech | ✅ | ✅ | ⚠️ Limited | ⚠️ Limited |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- TTS via [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the Troubleshooting section above
- Review the [Next.js documentation](https://nextjs.org/docs)

---

Made with ❤️ for CodeAlpha Internship
