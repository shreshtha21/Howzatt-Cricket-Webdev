import streamlit as st
import streamlit.components.v1 as components

# Read your HTML file (which can reference CSS & JS files)
with open("setup.html", "r", encoding="utf-8") as f:
    html_code = f.read()

# Display it in Streamlit
components.html(html_code, height=800, scrolling=True)
