#!/usr/bin/env bash
# Launcher for zeus.
#
# This system has a webkit2gtk/Wayland bug:
#   "Error 71 (Protocol error) dispatching to Wayland display."
# and a GBM buffer creation failure on X11.
# These env vars force a working rendering path (X11 + software GL).
#
# Usage: ./run-zeus.sh

export WEBKIT_DISABLE_DMABUF=1
export GDK_BACKEND=x11
export LIBGL_ALWAYS_SOFTWARE=1
export GALLIUM_DRIVER=llvmpipe
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/1000}"

exec "$(dirname "$0")/src-tauri/target/release/zeus" "$@"