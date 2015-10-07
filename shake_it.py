import uuid

from flask import Flask
from flask import (
    request,
    make_response,
    render_template,
)

app = Flask(__name__)


@app.route('/')
def index():
    response = make_response(render_template('top.html'))

    if not request.cookies.get('uuid'):
        uuid_str = str(uuid.uuid4())
        response.set_cookie('uuid', uuid_str)
        shakes[uuid_str] = 0

    return response


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
