from email.headerregistry import ContentTypeHeader
import json
import logging
from wsgiref.util import application_uri
import pyodbc
import psycopg2
import uuid
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, Update, WebAppData, WebAppInfo, Location
from telegram.ext import Updater, CommandHandler, ApplicationBuilder, MessageHandler, filters, Application, CallbackContext
from flask import Flask, request
# from telegram.ext.filters import Filters

# Set up logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)
app = Flask(__name__)

# Your Telegram bot token
BOT_TOKEN = '-----------------------'

# Pre-defined URL of the web game
WEB_GAME_URL = 'https://05bb-196-188-55-249.ngrok-free.app/quiz.html'

# PostgreSQL database configuration
DB_HOST = '--------'
DB_PORT = '--------'
DB_NAME = '--------'
DB_USER = '----------'
DB_PASSWORD = '-------'

# Conversation states
START, PLAYING, END = range(3)

# Initialize a dictionary to store user sessions
user_sessions = {}

def get_or_generate_session_id(user_id):

        # Generate a new session ID and store it
        session_id = str(uuid.uuid4())
        user_sessions[user_id] = session_id
        return session_id
# Define the start command handler

async def startgame(update, context):
    # Retrieve user information
    user = update.effective_user
    user_id = user.id
    username = user.username

    # Initialize score and generate session ID
    score = 0
    session_id = get_or_generate_session_id(user_id)

    # Store user data in the database
    store_user_data(user_id, username, score, session_id)

    # Send a message to the user with a link to play the game
    await context.bot.sendMessage(chat_id=user_id, text=f"Click [here]({WEB_GAME_URL}) to play the game!", parse_mode='Markdown')

    # Store user data in the context for later use if needed
    context.user_data['user_id'] = user_id
    context.user_data['username'] = username
    context.user_data['score'] = score
    context.user_data['session_id'] = session_id

def handle_callback(update, context):
    query = update.callback_query
    user_id = query.data.split("_")[1]  # Extract the user ID from the callback data
    # Here, you can send the user's data to your web app using a HTTP request or any other suitable method
    # For example, you can use the `requests` library to send a POST request to your web app's endpoint
    # with the user's Telegram user ID as a parameter.

async def start(update, context):
    user_id = update.effective_user.id
    username = update.effective_user.username
    session_id = get_or_generate_session_id(user_id)  # Retrieve or generate the session ID
    
    # Store user data in the database
    store_user_data(user_id, username, 0 , session_id)

    await context.bot.sendMessage(
        text=f"Hi {username}! Press Play To Start The Game",
        chat_id=user_id,
        reply_markup=ReplyKeyboardMarkup.from_button(
            KeyboardButton(
                text="Play",
                web_app=WebAppInfo(url=f"{WEB_GAME_URL}?user_id={user_id}&username={username}&session_id={session_id}"),
            )
        )
    )

async def info(update, context):
    user_id = update.message.chat_id
    await context.bot.sendMessage(chat_id=user_id, text="Get ready for a brain-teasing adventure with our Trivia Quiz Game! It's your chance to test your knowledge and have a great time while doing it. Our game offers a wide variety of exciting questions that span a range of topics. Choose the correct answers and see how you stack up on the leaderboard. Whether you're a trivia enthusiast or just looking for some fun, join us for a thrilling experience. Challenge yourself, challenge your friends, and let the trivia fun begin!", parse_mode='Markdown')

@app.route('/receive-score', methods=['POST'])
def receive_score():
    data = request.json  # Assuming the data is sent as JSON
    player_score = data.get('playerScore')
    # Process player_score here (e.g., store it in a database or perform some other action)
    return 'Score received successfully'

def store_user_data(user_id, username, score, session_id):
    try:
        # Establish a connection to the PostgreSQL database
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )

        cursor = conn.cursor()

        # Insert user information into the database
        cursor.execute('INSERT INTO "UserData" ("UserID", "Username", "Score", "session_id") VALUES (%s, %s, %s, %s)', (user_id, username, score, session_id))


        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        logger.error(f"Error storing user data: {str(e)}")

def main() -> None:
    """Start the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", startgame))
    application.add_handler(CommandHandler("game", start))
    application.add_handler(CommandHandler("info", info))

    #application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

    # Run the bot until the user presses Ctrl-C
    application.run_polling()

if __name__ == '__main__':
    main()


