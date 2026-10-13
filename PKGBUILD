# Maintainer: Zeus Developers <developers@zeus.app>
pkgname=zeus
pkgver=0.1.0
pkgrel=1
pkgdesc="AI agents on Arch Linux"
arch=('x86_64')
url="https://github.com/yourusername/zeus"
license=('MIT')
depends=('webkit2gtk-4.1' 'librsvg' 'hicolor-icon-theme')
makedepends=('rust' 'cargo' 'nodejs' 'npm' 'gtk3')
source=("$pkgname-$pkgver.tar.gz::https://github.com/yourusername/zeus/archive/v$pkgver.tar.gz")
sha256sums=('SKIP')

build() {
    cd "$srcdir/$pkgname-$pkgver"

    # Install dependencies
    export npm_config_cache="$srcdir/npm-cache"
    npm ci --ignore-scripts

    # Build frontend
    npm run build

    # Build tauri app
    cd src-tauri
    cargo build --release --locked
}

package() {
    cd "$srcdir/$pkgname-$pkgver"

    # Install binary
    install -Dm755 "src-tauri/target/release/zeus" "$pkgdir/usr/bin/zeus"

    # Install desktop entry
    install -Dm644 "src-tauri/zeus.desktop" "$pkgdir/usr/share/applications/zeus.desktop"

    # Install icons
    for size in 32 128 256 512; do
        if [[ -f "src-tauri/icons/${size}x${size}.png" ]]; then
            install -Dm644 "src-tauri/icons/${size}x${size}.png" "$pkgdir/usr/share/icons/hicolor/${size}x${size}/apps/zeus.png"
        fi
    done

    # Install license
    install -Dm644 LICENSE "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
}
