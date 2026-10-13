# Zeus - AI agents on Arch Linux

Zeus is a desktop application for Arch Linux that allows you to use AI with API keys, MCPs (Model Context Protocol), and more.

## Features

- **AI Chat**: Chat with various LLM providers
- **API Key Management**: Securely store and manage API keys
- **Provider Support**: Add and configure multiple AI providers (OpenAI, Anthropic, Ollama, etc.)
- **MCP Integration**: Model Context Protocol support for extending capabilities with tools
- **Conversation Management**: Save and manage your conversations
- **Cross-Platform**: Built with Tauri for native performance on Linux
- **Modern UI**: Clean, dark-themed interface

## Installation

### Arch Linux (AUR)

```bash
yay -S zeus
# or
paru -S zeus
```

### From Source

#### Prerequisites

- Rust (1.70+)
- Node.js (16+)
- npm or pnpm
- Tauri dependencies (for Linux: webkit2gtk-4.1, librsvg2)

On Arch Linux:

```bash
sudo pacman -S webkit2gtk-4.1 librsvg base-devel
```

#### Build

```bash
# Clone the repository
git clone https://github.com/yourusername/zeus.git
cd zeus

# Install frontend dependencies
npm install

# Build the application
npm run tauri build
```

The built packages will be in `src-tauri/target/release/bundle/`.

## Usage

1. Launch Zeus
2. Add your API keys in Settings > API Keys
3. Configure providers
4. Start chatting!

## Configuration

Zeus stores its configuration in:

- Linux: `~/.config/zeus/`
- Data: `~/.local/share/zeus/`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
