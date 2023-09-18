from flask import Flask, request, redirect, url_for, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_dance.contrib.github import make_github_blueprint, github
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin, SQLAlchemyStorage

from flask import send_from_directory
from models import Suscripcion

from flask_cors import CORS 
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FileField, SubmitField
from wtforms.validators import DataRequired
from models import db, Post, User
from flask_login import login_user, UserMixin, current_user, LoginManager
from models import OAuthConsumer

from flask_dance.contrib.google import make_google_blueprint, google

from flask_cors import cross_origin


from google.oauth2 import id_token
from google.auth.transport import requests

import jwt
import datetime
import pymysql
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mi_secret_key_segura_y_larga_1234567890'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:la1la2la3@localhost:3306/basededatosdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configura el ID de cliente de Google desde las variables de entorno
app.config['GOOGLE_OAUTH_CLIENT_ID'] = os.environ.get('684491439249-o8bie8efclbfc1gmpe5d29i32bs0kp3b.apps.googleusercontent.com')
app.config['GOOGLE_OAUTH_CLIENT_SECRET'] = os.environ.get('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')



# Configuración de la base de datos
app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'la1la2la3'
app.config['MYSQL_DB'] = 'basededatosdb'
app.config['MYSQL_PORT'] = 3306

# Inicializar el objeto LoginManager
login_manager = LoginManager(app)

# Configuración de almacenamiento de tokens OAuth en la base de datos
blueprint = make_github_blueprint(
    storage=SQLAlchemyStorage(OAuthConsumer, db.session, user=current_user)
)
app.register_blueprint(blueprint, url_prefix="/login")

# Blueprint para Google
google_blueprint = make_google_blueprint(
    client_id=app.config['GOOGLE_OAUTH_CLIENT_ID'],
    client_secret=app.config['GOOGLE_OAUTH_CLIENT_SECRET'],
    scope=["openid", "https://www.googleapis.com/auth/userinfo.email"],
    redirect_to="google_authorized",
    login_url="/login/google",
    authorized_url="/google/authorized"
)
app.register_blueprint(google_blueprint, url_prefix="/login")



CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})




db.init_app(app)


# Configura la función `user_loader` para Flask-Login
@login_manager.user_loader
def load_user(user_id):
    # Utiliza la función `query.get` de SQLAlchemy para cargar el usuario por su ID
    return User.query.get(int(user_id))




### GOOGLE

# Ruta para recibir la respuesta de Google después de la autenticación exitosa
@app.route("/google/authorized")
def google_authorized():
    if not google.authorized:
        return "Error: No se pudo autorizar con Google. Asegúrate de haber iniciado sesión correctamente.", 401

    # Obtener los datos del usuario autenticado en Google
    google_user_info = google.get("/oauth2/v2/userinfo").json()

    # Lógica para autenticar al usuario en tu aplicación y generar el token JWT
    # Aquí deberías verificar si el usuario ya existe en tu base de datos y
    # crearlo si no existe. Luego, genera el token JWT para el usuario autenticado.

   

    # Información del usuario (puedes agregar más datos si lo necesitas)
    user_info = {
        'user_id': google_user_info['id'],
        'username': google_user_info['name'],
        'email': google_user_info['email']
    }

    # Clave secreta para firmar el token (reemplaza el valor por una clave segura)
    secret_key = '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'

    # Fecha de expiración del token (por ejemplo, 1 hora desde ahora)
    expiration_date = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

    # Crear el token JWT
    token = jwt.encode({'user': user_info, 'exp': expiration_date}, secret_key, algorithm='HS256')

    # Devolver el token en la respuesta
    return jsonify({'token': token}), 200
   



#Utimos POST 
@app.route('/api/last_posts', methods=['GET'])
def get_last_posts():
    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Realizar la consulta a la base de datos para obtener los últimos posts
        cursor.execute('SELECT * FROM entrada ORDER BY id DESC LIMIT 10')
        results = cursor.fetchall()

        # Formatear los resultados y devolverlos como respuesta
        formatted_results = [{'id': row[0], 'title': row[1], 'message': row[2], 'image': row[3]} for row in results]
        return jsonify(formatted_results)

    except Exception as e:
        print("Error en la base de datos:", e)
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()




#BUSQUEDA DE DATOS 

# Nueva ruta para obtener los detalles de un blog por su ID
@app.route('/api/blog/<int:blog_id>', methods=['GET'])
def get_blog_details(blog_id):
    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Realizar la consulta a la base de datos
        cursor.execute('SELECT * FROM entrada WHERE id = %s', blog_id)
        result = cursor.fetchone()

        if not result:
            return jsonify({'error': 'No se encontró ningún blog con el id especificado'}), 404

        # Formatear el resultado y devolverlo como respuesta
        formatted_result = {'id': result[0], 'title': result[1], 'message': result[2], 'image': result[3]}
        return jsonify(formatted_result)

    except Exception as e:
        print("Error en la base de datos:", e)
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()
        
# Configuración de la carpeta de subida
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/search/entrada', methods=['GET'])
def search_by_entrada():
    query_entrada = request.args.get('q', '').strip()

    if not query_entrada:
        return jsonify([])

    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Realizar la consulta a la base de datos en la tabla 'entrada'
        cursor.execute('SELECT * FROM entrada WHERE message LIKE %s', f'%{query_entrada}%')
        results = cursor.fetchall()

        # Formatear los resultados y devolverlos como respuesta
        formatted_results = [{'id': row[0], 'title': row[1], 'message': row[2], 'image': row[3]} for row in results]
        return jsonify(formatted_results)

    except Exception as e:
        print("Error en la base de datos:", e)
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()

@app.route('/upload', methods=['POST'])
def upload_file():
    image = request.files.get('image')
    title = request.form.get('title')
    message = request.form.get('message')

    if image:
        # Guardar la imagen en la carpeta de subida
        image_filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image.save(image_path)

        # Crear una nueva entrada en la base de datos con la ruta de la imagen guardada
        connection = pymysql.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            db=app.config['MYSQL_DB'],
            port=app.config['MYSQL_PORT']
        )

        cursor = connection.cursor()

        try:
            cursor.execute('INSERT INTO entrada (title, message, image) VALUES (%s, %s, %s)',
                           (title, message, image_filename))
            connection.commit()
            return jsonify({'message': 'Entrada creada correctamente'})

        except Exception as e:
            print("Error en la base de datos:", e)
            connection.rollback()
            return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

        finally:
            cursor.close()
            connection.close()



@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '').strip()
    search_type = request.args.get('type', 'id').strip()

    if not query:
        return jsonify([])

    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Realizar la consulta a la base de datos
        if search_type == 'id':
            cursor.execute('SELECT * FROM entrada WHERE id = %s', query)
        elif search_type == 'message':
            cursor.execute('SELECT * FROM entrada WHERE message LIKE %s', f'%{query}%')
        elif search_type == 'title':
            cursor.execute('SELECT * FROM entrada WHERE title LIKE %s', f'%{query}%')
        else:
            return jsonify({'error': 'Tipo de búsqueda no válido'}), 400

        results = cursor.fetchall()

        # Formatear los resultados y devolverlos como respuesta
        formatted_results = [{'id': row[0], 'title': row[1], 'message': row[2], 'image': row[3]} for row in results]
        return jsonify(formatted_results)

    except Exception as e:
        print("Error en la base de datos:", e)
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()





@app.route('/api/search/id', methods=['GET'])
def search_by_id():
    query_id = request.args.get('q', '').strip()

    if not query_id:
        return jsonify([])

    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Realizar la consulta a la base de datos
        cursor.execute('SELECT * FROM posts WHERE id = %s', query_id)
        result = cursor.fetchone()

        if not result:
            return jsonify({'error': 'No se encontró ningún post con el id especificado'}), 404

        # Formatear el resultado y devolverlo como respuesta
        formatted_result = {'id': result[0], 'title': result[1], 'message': result[2]}
        return jsonify(formatted_result)

    except Exception as e:
        print("Error en la base de datos:", e)  # Agregar esta línea para imprimir el error en la consola
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()
        
        
@app.route('/api/search/message', methods=['GET'])
def search_by_message():
    query_message = request.args.get('q', '').strip()

    if not query_message:
        return jsonify([])

    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Realizar la consulta a la base de datos
        cursor.execute('SELECT * FROM posts WHERE message LIKE %s', f'%{query_message}%')
        results = cursor.fetchall()

        # Formatear los resultados y devolverlos como respuesta
        formatted_results = [{'id': row[0], 'title': row[1], 'message': row[2]} for row in results]
        return jsonify(formatted_results)

    except Exception as e:
        print("Error en la base de datos:", e)  # Agregar esta línea para imprimir el error en la consola
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()
        
        
@app.route('/api/search/title', methods=['GET'])
def search_by_title():
    query_title = request.args.get('q', '').strip()

    if not query_title:
        return jsonify([])

    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Realizar la consulta a la base de datos
        cursor.execute('SELECT * FROM posts WHERE title LIKE %s', f'%{query_title}%')
        results = cursor.fetchall()

        # Formatear los resultados y devolverlos como respuesta
        formatted_results = [{'id': row[0], 'title': row[1], 'message': row[2]} for row in results]
        return jsonify(formatted_results)

    except Exception as e:
        print("Error en la base de datos:", e)  # Agregar esta línea para imprimir el error en la consola
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()
      
        
#Manejar errores        
@app.errorhandler(Exception)
def handle_error(error):
    # Devolver una respuesta JSON con el mensaje de error y el código de estado 500
    response = jsonify({'error': 'Ocurrió un error en el servidor'})
    response.status_code = 500
    return response
        
# Ruta para obtener los detalles de un resultado por su ID
@app.route('/api/resultados/<int:result_id>', methods=['GET'])
def obtener_detalles_resultado(result_id):
    # Realiza la lógica para obtener los detalles del resultado por su ID desde tu base de datos o almacenamiento
    try:
        # Realizar la conexión a la base de datos
        connection = pymysql.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            db=app.config['MYSQL_DB'],
            port=app.config['MYSQL_PORT']
        )

        cursor = connection.cursor()

        # Obtener los detalles del resultado desde la base de datos
        cursor.execute('SELECT * FROM resultados WHERE id = %s', (result_id,))
        resultado = cursor.fetchone()

        if not resultado:
            return jsonify({'error': 'Resultado no encontrado'}), 404

        # Formatear los datos del resultado y devolverlos como respuesta
        resultado_data = {
            'id': resultado[0],
            'title': resultado[1],
            'description': resultado[2],
            # Agrega más campos del resultado según la estructura de tu base de datos
        }

        return jsonify(resultado_data), 200

    except Exception as e:
        print("Error en la base de datos:", e)
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()




# Ruta para manejar las solicitudes OPTIONS
@app.route("/api/login", methods=["OPTIONS"])
def handle_options():
    response = jsonify(success=True)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response



# Ruta para iniciar sesión
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Verificar si el usuario existe en la base de datos
        user = User.query.filter_by(username=username).first()

        if not user:
            return jsonify({'error': 'Nombre de usuario o contraseña incorrectos'}), 401

        # Verificar si la contraseña es correcta
        if not user.check_password(password):
            return jsonify({'error': 'Nombre de usuario o contraseña incorrectos'}), 401

        # Autenticar al usuario usando Flask-Login
        login_user(user)

        # Generar un token de autenticación (JWT) con una validez de 1 día
        token_payload = {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm='HS256')

        # Devolver el token en la respuesta
        return jsonify({'mensaje': 'Inicio de sesión exitoso', 'token': token}), 200

    except Exception as e:
        print("Error en el inicio de sesión:", e)
        return jsonify({'error': 'Ocurrió un error en el servidor'}), 500




# Rutas para crear y buscar publicaciones (mismas rutas que tenías antes)

# Ruta para procesar una nueva entrada
@app.route('/entrada', methods=['POST'])
def procesar_entrada():
    if request.method == 'POST':
        title = request.form.get('title')
        message = request.form.get('message')
        image = request.files.get('image')

        if title and message and image:
            # Verificar que la carpeta de destino exista, si no, crearla
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])

            # Guardar la imagen en la carpeta temporal
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], image.filename.split('/')[-1]))

            # Crear una nueva entrada en la base de datos
            new_post = Post(title=title, message=message, image=image.filename)
            db.session.add(new_post)
            db.session.commit()

            return jsonify({'mensaje': 'Entrada guardada correctamente'}), 200
        else:
            return jsonify({'error': 'Falta algún campo en el formulario'}), 400
        
        

        
# Ruta para obtener todas las publicaciones
@app.route('/obtener_publicaciones', methods=['GET'])
def obtener_publicaciones():
    try:
        posts = Post.query.order_by(Post.id.desc()).all()
        publicaciones = []
        for post in posts:
            publicacion = {
                'id': post.id,
                'title': post.title,
                'message': post.message,
                'image': post.image
            }
            publicaciones.append(publicacion)

        # Lógica para obtener las publicaciones y formatearlas como un objeto JSON
        return jsonify(publicaciones)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
CORS(app, resources={r"/obtener_publicacion/*": {"origins": "http://localhost:3000"}})

    
@app.route('/api/obtener_publicacion/<int:post_id>', methods=['GET'])
def obtener_publicacion(post_id):
    try:
        post = Post.query.get(post_id)

        if not post:
            return jsonify({'error': 'Publicación no encontrada'}), 404

        publicacion = {
            'id': post.id,
            'title': post.title,
            'message': post.message,
            'image': post.image
        }

        return jsonify(publicacion), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    

# Ruta para eliminar un post por su ID
@app.route('/api/eliminar_post/<int:post_id>', methods=['DELETE'])
def eliminar_post(post_id):
    try:
        # Busca el post por su ID en la base de datos
        post = Post.query.get(post_id)

        # Verifica si el post existe
        if not post:
            return jsonify({'mensaje': 'El post no fue encontrado'}), 404

        # Elimina el post de la base de datos
        db.session.delete(post)
        db.session.commit()

        # Respuesta exitosa
        return jsonify({'mensaje': 'Post eliminado correctamente'}), 200
    except Exception as e:
        print('Error al eliminar el post:', str(e))
        return jsonify({'mensaje': 'Error interno del servidor'}), 500


    

    
    

    
# Ruta para editar una publicación
@app.route('/api/editar_publicacion/<int:post_id>', methods=['PUT'])
def editar_publicacion(post_id):
    try:
        post = Post.query.get(post_id)

        if not post:
            return jsonify({'error': 'Publicación no encontrada'}), 404

        # Obtener los datos actualizados de la publicación desde la solicitud JSON
        data = request.get_json()
        title = data.get('title')
        message = data.get('message')
        image = data.get('image')

        if title:
            post.title = title
        if message:
            post.message = message
        if image:
            post.image = image

        db.session.commit()

        return jsonify({'mensaje': 'Publicación actualizada correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    

# Ruta para registrar un nuevo usuario
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')  # Asegúrate de que el nombre del campo sea "email"

    if not username or not password:
        return jsonify({'error': 'Faltan el nombre de usuario o la contraseña'}), 400

    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Verificar si el usuario ya existe en la base de datos
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'message': 'El usuario ya existe'}), 400

        # Insertar el nuevo usuario en la base de datos
        cursor.execute('INSERT INTO users (username, password, email) VALUES (%s, %s, %s)', (username, password, email))
        connection.commit()

        return jsonify({'message': 'Usuario registrado exitosamente'})

    except Exception as e:
        print("Error en la base de datos:", e)  # Agrega esta línea para imprimir el error en la consola
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()
        
@app.route('/api/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({'error': 'Faltan datos para actualizar el usuario'}), 400

    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Verificar si el usuario existe en la base de datos
        cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
        existing_user = cursor.fetchone()

        if not existing_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Actualizar la información del usuario en la base de datos
        cursor.execute('UPDATE users SET username = %s, password = %s, email = %s WHERE id = %s', (username, password, email, user_id))
        connection.commit()

        return jsonify({'message': 'Información de usuario actualizada exitosamente'})

    except Exception as e:
        print("Error en la base de datos:", e)
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()       
        



@app.route('/api/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Verificar si el usuario existe en la base de datos
        cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
        existing_user = cursor.fetchone()

        if not existing_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Eliminar el usuario de la base de datos
        cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
        connection.commit()

        return jsonify({'message': 'Usuario eliminado exitosamente'})

    except Exception as e:
        print("Error en la base de datos:", e)
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # Realizar la conexión a la base de datos
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

    cursor = connection.cursor()

    try:
        # Obtener información del usuario desde la base de datos
        cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Formatear los datos del usuario y devolverlos como respuesta
        user_data = {
            'id': user[0],
            'username': user[1],
            'email': user[3]
        }
        return jsonify(user_data)

    except Exception as e:
        print("Error en la base de datos:", e)
        return jsonify({'error': 'Ocurrió un error en la base de datos'}), 500

    finally:
        cursor.close()
        connection.close()
        
        
# Agregar el encabezado CORS para permitir peticiones desde http://localhost:3000
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
    return response

app.after_request(add_cors_headers)



# Definir la ruta de la carpeta de subida de imágenes en tu escritorio
app.config['UPLOAD_FOLDER'] = '/Users/Atila/Desktop/UPLOAD_FOLDER'

# Ruta para servir imágenes estáticas
@app.route('/img/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# Ruta para suscribirse a la newsletter
@app.route('/api/suscribir', methods=['POST'])
def suscribir():
    try:
        # Obtener los datos del formulario enviado desde el frontend
        data = request.get_json()
        email = data.get('email')
        name = data.get('name', '')

        # Verificar si 'name' es válido antes de insertarlo en la base de datos
        if name is not None and name != '':
            nueva_suscripcion = Suscripcion(email=email, name=name)
            db.session.add(nueva_suscripcion)
            db.session.commit()
            return jsonify({'message': 'Suscripción exitosa'}), 200
        else:
            return jsonify({'error': 'El campo "name" es obligatorio'}), 400

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Error al procesar la suscripción'}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

