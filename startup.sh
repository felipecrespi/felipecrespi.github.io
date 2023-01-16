#! /bin/bash
cd PB
python3 -m virtualenv -p `which python3.10` venv
source venv/bin/activate
pip install -r requirements.txt
chmod +x manage.py
./manage.py makemigrations
./manage.py migrate
cd ..
cd pf
npm install
cd ..
chmod +x run.sh