import os
import random
import time

class UnivacData:
    def __init__(self, docs_path="./docs"):
        self.docs_path = docs_path
        self.typer_history = []
        
    def get_sensors(self):
        # Placeholder for actual hardware hooks
        return {
            "temp_interior": random.uniform(65.0, 85.0),
            "entries_per_sec": random.randint(0, 120),
            "shallow_water": random.choice([True, False]),
            "vibration": random.uniform(0.0, 5.0),
            "amplitude": random.uniform(220.0, 240.0),
            "voltage": random.uniform(11.5, 12.5),
            "scots_tracker": "LOCKED" if random.random() > 0.1 else "SEARCHING"
        }

    def scan_docs_questions(self):
        questions = []
        if os.path.exists(self.docs_path):
            for file in os.listdir(self.docs_path):
                if file.endswith(".md"):
                    with open(os.path.join(self.docs_path, file), 'r') as f:
                        for line in f:
                            if "?" in line or "TODO" in line:
                                questions.append(f"[{file}] {line.strip()}")
        return questions

    def get_typer_commands(self):
        # Simulate bridging recent commands
        # In prod, tail your actual bash_history or log file
        return ["sudo mount /dev/gantry", "univac_save --force", "ping 192.168.1.50"]
