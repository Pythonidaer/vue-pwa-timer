#!/bin/bash
# Simple script to create placeholder PWA icons using ImageMagick
# If you don't have ImageMagick, install it: brew install imagemagick

# Create 192x192 icon (dark gray with "T" text)
convert -size 192x192 xc:#0d0d0d -gravity center -pointsize 120 -fill white -font Arial-Bold label:"T" public/pwa-192x192.png

# Create 512x512 icon (dark gray with "T" text)
convert -size 512x512 xc:#0d0d0d -gravity center -pointsize 320 -fill white -font Arial-Bold label:"T" public/pwa-512x512.png

echo "Placeholder icons created!"
