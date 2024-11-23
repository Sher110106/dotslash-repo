from flask import Flask, render_template, request
from fpdf import FPDF
from google.cloud import aiplatform
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Load Google Gemini API configurations
project_id = os.getenv("GOOGLE_PROJECT_ID")
location = os.getenv("GOOGLE_LOCATION")
model_name = os.getenv("GEMINI_MODEL_NAME")

# Initialize Google AI Platform
aiplatform.init(project=project_id, location=location)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/questionnaire', methods=['GET', 'POST'])
def questionnaire():
    if request.method == 'POST':
        # Collect answers
        answers = [request.form[key] for key in request.form.keys()]
        
        # Save responses to PDF
        save_to_pdf(answers)

        # Analyze answers and generate follow-up questions
        follow_up_questions = analyze_answers(answers)
        
        return render_template('result.html', follow_up=follow_up_questions)

    # Initial questions
    questions = [
        "How are you feeling today?",
        "What is stressing you out?",
        "What made you happy recently?"
    ]
    return render_template('questionnaire.html', questions=questions)


def save_to_pdf(answers):
    """Save responses to a PDF."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    pdf.cell(200, 10, txt="Questionnaire Responses", ln=True, align='C')
    for idx, answer in enumerate(answers, start=1):
        pdf.cell(0, 10, txt=f"Q{idx}: {answer}", ln=True)
    
    pdf.output("responses.pdf")


def analyze_answers(answers):
    """Analyze responses and generate follow-up questions using Gemini."""
    # Combine answers into a single prompt
    prompt = f"Based on these responses: {answers}, suggest follow-up questions to understand mental health better."
    
    # Load Gemini model
    model = aiplatform.Model(model_name=model_name)
    
    # Generate predictions
    prediction = model.predict([prompt])
    return prediction[0].split("\n")  # Return follow-up questions as a list


if __name__ == '__main__':
    app.run(debug=True)
