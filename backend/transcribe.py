import sys
import whisper
import warnings

# Suppress FutureWarnings and UserWarnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

def transcribe(audio_path):
    try:
        model = whisper.load_model("medium")  # You can change the model size if needed
        result = model.transcribe(audio_path, language="es")
        print(result['text'])  # Output transcription to stdout
    except Exception as e:
        print(f"Error during transcription: {e}")  # Print error message

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <audio_file_path>")
        sys.exit(1)  # Exit if no audio file is provided

    audio_file = sys.argv[1]
    transcribe(audio_file)
