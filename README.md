# Cairn: An interactive AI development kit

## Overview
Cairn is a framework for creating AI-driven interactive experiences that interpret gestural patterns. This guide will help you set up your development environment and create your first Cairn-powered application.

## Prerequisites
- Node.js (v14 or higher)
- Basic understanding of JavaScript and p5.js
- Anthropic API key

## Quick Start

### 1 Install Cairn
```bash
# Clone the repository
git clone https://github.com/your-repo/cairn
cd cairn

# Install dependencies
npm install
```

### 2 Install Cairn worker
See directions in [Cairn worker repo](https://github.com/urverkmi/cairn-worker)


## Core Concepts

### Pattern Analysis
Cairn analyzes interaction patterns using three primary metrics:
- **Spatial Complexity**: Distribution and clustering of interactions
- **Temporal Complexity**: Timing and rhythm of interactions
- **Speed**: Speed of interactions
See more detail in PatternAnalyzer.js.


## Examples

Explore the included demo experiences:
- `index.html`: Sensei Cairn responds to your interactions in philosophical messages

Each example demonstrates different aspects of the framework and can serve as a starting point for your own projects.
