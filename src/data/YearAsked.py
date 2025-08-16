import json

def update_year_asked(input_file, output_file, new_year):
  """
  Reads a JSON file, updates the 'YearAsked' field for all entries,
  and writes the modified data to a new JSON file.

  Args:
    input_file: The path to the input JSON file.
    output_file: The path to the output JSON file.
    new_year: The new year to set for the 'YearAsked' field.
  """
  try:
    with open(input_file, 'r') as f:
      data = json.load(f)

    # Assuming the JSON file contains a list of objects
    if isinstance(data, list):
      for item in data:
        if 'YearAsked' in item:
          item['YearAsked'] = new_year
    # If the JSON file contains a single object
    elif isinstance(data, dict):
        if 'YearAsked' in data:
            data['YearAsked'] = new_year

    with open(output_file, 'w') as f:
      json.dump(data, f, indent=4)

    print(f"Successfully updated 'YearAsked' to {new_year} and saved to {output_file}")

  except FileNotFoundError:
    print(f"Error: The file {input_file} was not found.")
  except json.JSONDecodeError:
    print(f"Error: Could not decode JSON from the file {input_file}.")
  except Exception as e:
    print(f"An unexpected error occurred: {e}")

# --- How to use the script ---

# 1. Make sure you have a JSON file named 'input.json' in the same directory
#    as this script. For example, your 'input.json' might look like this:
#    [
#      {
#        "Question": "What is the capital of France?",
#        "YearAsked": 2022
#      },
#      {
#        "Question": "Who wrote 'To Kill a Mockingbird'?",
#        "YearAsked": 2021
#      }
#    ]

# 2. Set the desired new year.
new_year_value = "Février 2025 (Normale)"

# 3. Specify the input and output file names.
input_filename = 'Physiologie Digestive (Février 2025).json'
output_filename = 'output.json'

# 4. Call the function to perform the update.
update_year_asked(input_filename, output_filename, new_year_value)
