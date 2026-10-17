#!/usr/bin/env bash
# Wrapper for zeus that works around a webkit2gtk/Wayland bug:
# "Error 71 (Protocol error) dispatching to Wayland display."
# Disabling DMA-BUF forces webkit to use a working rendering path.
export WEBKIT_DISABLE_DMABUF=1
exec "$(dirname "$0")/src-tauri/target/release/zeus" "$@"