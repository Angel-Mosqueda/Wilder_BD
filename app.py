from flask import (Flask, jsonify, request, render_template, \
make_response, flash, url_for, send_from_directory)
from flask_mysqldb import MySQL
from werkzeug.utils import secure_filename
from utils import allowed_file
import hashlib, json, os
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLER = os.path.join(BASE_DIR, "static")
print(os.getcwd())

def create_app():
    app = Flask(
    __name__,
    template_folder='files',
    static_url_path='',
    static_folder='files'
    )

    app.config['MYSQL_HOST'] = os.getenv('BD_SERVER')
    app.config['MYSQL_USER'] = os.getenv('BD_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('BD_PASSWORD')
    app.config['MYSQL_DB'] = os.getenv('BD_BD')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLER

    return app

app = create_app()

mysql = MySQL(app)

@app.route('/static/<path:filename>') 
def send_file(filename): 
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/iniciar/', methods=['POST'])
def iniciar_sesion():
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = (
        "SELECT * FROM USUARIO WHERE CORREO = '"
        + data["EMAIL"] +
        "' AND PASSWORD = sha2('"
        + data["PASSWORD"] + "', 512);"
    )
    cur.execute(query)
    mysql.connection.commit()
    row = cur.fetchone()
    if row:
        response = make_response(json.dumps(
            {
                'exito': True,
                'desc': 'Bienvenido ' + row[1],
                'usrinfo': {
                    "id": row[0],
                    "nombre": row[1],
                    "apepat": row[2],
                    "apemat": row[3],
                    "rol": row[4],
                    "foto": row[5],
                    "activo": ord(row[6]),
                    "empresa_id": row[7],
                    "correo": row[8]
                }
            }
        ))
        response.set_cookie('logged', 'true')
        response.set_cookie('empresa', str(row[7]))
        response.set_cookie('usuario', str(row[0]))
    else:
        response = make_response(json.dumps(
            {
                'exito': False,
                'desc': 'Error en usuario o contraseña.'
            }
        ))
    cur.close()
    return response


@app.route('/get_ok/', methods=['GET'])
def enviar_ok():
    response = {
        'status': 'ok'
    }
    
    return jsonify(response)


@app.route('/add_empresa/', methods=['POST'])
def crear_empresa():
    response = {}
    cur = mysql.connection.cursor()
    query = ("INSERT INTO EMPRESA (NOMBRE,"
    "RAZSOC) VALUES ("
    + "'" + request.form['NOMBRE'] + "', "
    + "'" + request.form['RAZSOC'] + "');"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response = {
        'exito': isinstance(last_id, int),
        'id_insertado': last_id
    }
    cur.close()
    return jsonify(response)


@app.route('/get_empresas/', methods=['GET'])
def obtener_empresas():
    response = {}
    response["empresas"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT ID, RAZSOC FROM EMPRESA WHERE TIPO IS NULL;")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    for empresa in rows:
        response["empresas"].append({
            "id": empresa[0],
            "razon_social": empresa[1]
        })
    cur.close()
    return response


################ CRUD UBICACION ######################
@app.route('/get_ubicaciones/', methods=['GET'])
def obtener_ubicaciones():
    response = {}
    response["ubicaciones"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_UBICACIONES', [empresa_id])
    rows = cur.fetchall()
    for ubicacion in rows:
        response["ubicaciones"].append({
            "id": ubicacion[0],
            "nombre": ubicacion[1],
            "latitud": ubicacion[2],
            "longitud": ubicacion[3]
        })
    if len(response['ubicaciones']) == 0:
        response['exito'] = False
        response['desc'] = "No existen ubicaciones, intenta crear una."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_ubicacion/', methods=['POST'])
def actualizar_ubicaciones():
    response = {}
    response["ubicaciones"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE UBICACION SET NOMBRE = '" + data['NOMBRE'] +
    "', LATITUD = " + data['LATITUD'] + ", LONGITUD = " + data['LONGITUD'] +
    " WHERE ID = " + data['ID'] + ";")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_UBICACIONES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for ubicacion in rows:
        response["ubicaciones"].append({
            "id": ubicacion[0],
            "nombre": ubicacion[1],
            "latitud": ubicacion[2],
            "longitud": ubicacion[3]
        })
    cur.close()
    return response


@app.route('/delete_ubicacion/<id>', methods=['GET'])
def eliminar_ubicaciones(id):
    response = {}
    response["ubicaciones"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM UBICACION WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_UBICACIONES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for ubicacion in rows:
        response["ubicaciones"].append({
            "id": ubicacion[0],
            "nombre": ubicacion[1],
            "latitud": ubicacion[2],
            "longitud": ubicacion[3]
        })
    cur.close()
    return response


@app.route('/create_ubicacion/', methods=['POST'])
def crear_ubicaciones():
    response = {}
    response["ubicaciones"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO UBICACION (NOMBRE, LATITUD, LONGITUD, EMPRESA_ID) VALUES ('" + data['NOMBRE'] +
    "', " + data['LATITUD'] + ", "+ data['LONGITUD'] +", " + str(empresa_id) + ")")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur.callproc('GET_UBICACIONES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for ubicacion in rows:
        response["ubicaciones"].append({
            "id": ubicacion[0],
            "nombre": ubicacion[1],
            "latitud": ubicacion[2],
            "longitud": ubicacion[3]
        })
    cur.close()
    return response
################ FIN CRUD UBICACION ##################

################ CRUD PROVEEDORES ######################
@app.route('/get_proveedores/', methods=['GET'])
def obtener_proveedores():
    response = {}
    response["proveedores"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_PROVEEDORES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for proveedor in rows:
        response["proveedores"].append({
            "id": proveedor[0],
            "razsoc": proveedor[1],
            "nombre": proveedor[2]
        })
    if len(response['proveedores']) == 0:
        response['exito'] = False
        response['desc'] = "No existen proveedores, intenta crear uno."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_proveedor/', methods=['POST'])
def actualizar_proveedores():
    response = {}
    response["proveedores"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE EMPRESA SET NOMBRE = '" + data['NOMBRE'] +
    "', RAZSOC = '" + data['RAZSOC'] + "' WHERE ID = " + data['ID'] + ";")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_PROVEEDORES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for proveedor in rows:
        response["proveedores"].append({
            "id": proveedor[0],
            "razsoc": proveedor[1],
            "nombre": proveedor[2]
        })
    cur.close()
    return response


@app.route('/delete_proveedor/<id>', methods=['GET'])
def eliminar_proveedores(id):
    response = {}
    response["proveedores"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM EMPRESA WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_PROVEEDORES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for proveedor in rows:
        response["proveedores"].append({
            "id": proveedor[0],
            "razsoc": proveedor[1],
            "nombre": proveedor[2]
        })
    cur.close()
    return response


@app.route('/create_proveedor/', methods=['POST'])
def crear_proveedores():
    response = {}
    response["proveedores"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO EMPRESA (NOMBRE, RAZSOC, TIPO, EMPRESA_ID) VALUES ('" + data['NOMBRE'] +
    "', '" + data['RAZSOC'] + "', 'PROVEEDOR', " + str(empresa_id) + ")")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur.callproc('GET_PROVEEDORES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for proveedor in rows:
        response["proveedores"].append({
            "id": proveedor[0],
            "razsoc": proveedor[1],
            "nombre": proveedor[2]
        })
    cur.close()
    return response
################ FIN CRUD PROVEEDORES ##################

################### INICIO FILTRO ######################
@app.route('/filtro_productos', methods=['GET'])
def obtener_productos():
    response = {}
    response["productos"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))

    categorias = request.args.get('categorias')
    filtro = request.args.get('filtro')
    categorias = categorias if categorias is not None else ''
    filtro = filtro if filtro is not None else ''

    cur.callproc('FILTRO_PRODUCTOS', [categorias, filtro, empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for producto in rows:
        response["productos"].append({
            "id": producto[0],
            "usuario_id": producto[1],
            "nombre": producto[2],
            "descripcion": producto[3],
            "imagen_referencia": producto[4]
        })
    if len(response['productos']) == 0:
        response['exito'] = False
        response['desc'] = "No existen productos, intenta crear uno."
    else:
        response['exito'] = True
    cur.close()
    return response
###################### FIN FILTRO ######################

@app.route('/get_categorias/', methods=['GET'])
def obtener_categorias():
    response = {}
    response["categorias"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CATEGORIAS', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for categoria in rows:
        response["categorias"].append({
            "id": categoria[0],
            "nombre": categoria[1]
        })
    if len(response['categorias']) == 0:
        response['exito'] = False
        response['desc'] = "No existen categorias, intenta creando unas."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_categoria/', methods=['POST'])
def actualizar_categorias():
    response = {}
    response["categorias"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE CATEGORIA SET NOMBRE = '" + data['NOMBRE'] +
    "' WHERE ID = " + data['ID'] + ";")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CATEGORIAS', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for categoria in rows:
        response["categorias"].append({
            "id": categoria[0],
            "nombre": categoria[1]
        })
    cur.close()
    return response


@app.route('/delete_categoria/<id>', methods=['GET'])
def eliminar_categorias(id):
    response = {}
    response["categorias"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM CATEGORIA WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CATEGORIAS', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for categoria in rows:
        response["categorias"].append({
            "id": categoria[0],
            "nombre": categoria[1]
        })
    cur.close()
    return response


@app.route('/create_categoria/', methods=['POST'])
def crear_categorias():
    response = {}
    response["categorias"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO CATEGORIA (NOMBRE, EMPRESA_ID) VALUES ('" + data['NOMBRE'] +
    "', " + str(empresa_id) + ")")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur.callproc('GET_CATEGORIAS', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for categoria in rows:
        response["categorias"].append({
            "id": categoria[0],
            "nombre": categoria[1]
        })
    cur.close()
    return response

######################### INICIO CONSUMIBLE #####################
@app.route('/get_consumibles/', methods=['GET'])
def obtener_consumibles():
    response = {}
    response["consumibles"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CONSUMIBLES', [empresa_id])
    rows = cur.fetchall()
    for consumible in rows:
        response["consumibles"].append({
            "id": consumible[0],
            "nombre": consumible[1],
            "sku": consumible[2],
            "cantidad": consumible[3],
            "descripcion": consumible[4],
            "proveedor": consumible[5],
            "empresa_id": consumible[6]
        })
    if len(response['consumibles']) == 0:
        response['exito'] = False
        response['desc'] = "No existen consumibles, intenta crear alguno."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_consumible/', methods=['POST'])
def actualizar_consumibles():
    response = {}
    response["consumibles"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE CONSUMIBLE SET NOMBRE = '" + data['NOMBRE'] +
    "', cantidad = "+ data["CANTIDAD"] +", sku = '" + data["SKU"] + "',"
    " descripcion = '" + data["DESCRIPCION"] + "'"
    " WHERE ID = " + data['ID'] + ";")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CONSUMIBLES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for consumible in rows:
        response["consumibles"].append({
            "id": consumible[0],
            "nombre": consumible[1],
            "sku": consumible[2],
            "cantidad": consumible[3],
            "descripcion": consumible[4],
            "proveedor": consumible[5],
            "empresa_id": consumible[6]
        })
    cur.close()
    return response


@app.route('/delete_consumible/<id>', methods=['GET'])
def eliminar_consumibles(id):
    response = {}
    response["consumibles"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM CONSUMIBLE WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CONSUMIBLES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for consumible in rows:
        response["consumibles"].append({
            "id": consumible[0],
            "nombre": consumible[1],
            "sku": consumible[2],
            "cantidad": consumible[3],
            "descripcion": consumible[4],
            "proveedor": consumible[5],
            "empresa_id": consumible[6]
        })
    cur.close()
    return response


@app.route('/create_consumible/', methods=['POST'])
def crear_consumibles():
    response = {}
    response["consumibles"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO CONSUMIBLE (CANTIDAD, SKU, NOMBRE, DESCRIPCION, EMPRESA_ID, PROVEEDOR) VALUES"
    " ('" + str(data['CANTIDAD']) + "', '" + data['SKU'] + "', '" + data['NOMBRE'] + "', '" + str(data['DESCRIPCION']) + "', " + str(empresa_id) +
    ", " + str(data['PROVEEDOR']) + ")")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur.close()
    return response
######################### FIN CONSUMIBLE #####################

######################### INICIO USUARIO #####################
@app.route('/get_usuarios/', methods=['GET'])
def obtener_usuarios():
    response = {}
    response["usuarios"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    usuario_id = request.cookies.get('usuario')

    cur.callproc('GET_USUARIOS', [empresa_id, usuario_id])
    rows = cur.fetchall()
    for usuario in rows:
        response["usuarios"].append({
            "id": usuario[0],
            "nombre": usuario[1],
            "apepat": usuario[2],
            "apemat": usuario[3],
            "correo": usuario[4],
            "rol": usuario[5],
            "foto": usuario[6],
            "activo": ord(usuario[7])
        })
    if len(response['usuarios']) == 0:
        response['exito'] = False
        response['desc'] = "No existen usuarios, intenta crear alguno."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_usuario/', methods=['POST'])
def actualizar_usuarios():
    response = {}
    response["usuarios"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    empresa_id = int(request.cookies.get('empresa'))
    usuario_id = request.cookies.get('usuario')
    query = (
        "UPDATE USUARIO SET "
        "NOMBRE ='" + data['NOMBRE'] + "',"
        "APEPAT ='" + data['APEPAT'] + "',"
        "APEMAT ='" + data['APEMAT'] + "',"
        # "CORREO =" + data['NOMBRE'] + ","
        "ROL =" + str(data['ROL']) + ","
        "ACTIVO =" + str(data['ACTIVO']) + " WHERE "
        "ID = " + data['ID'] + " AND "
        "EMPRESA_ID = " + str(empresa_id)
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    cur.callproc('GET_USUARIOS', [empresa_id, usuario_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for usuario in rows:
        response["usuarios"].append({
            "id": usuario[0],
            "nombre": usuario[1],
            "apepat": usuario[2],
            "apemat": usuario[3],
            "correo": usuario[4],
            "rol": usuario[5],
            "foto": usuario[6],
            "activo": ord(usuario[7])
        })
    cur.close()
    return response


@app.route('/delete_usuario/<id>', methods=['GET'])
def eliminar_usuarios(id):
    response = {}
    response["usuarios"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM USUARIO WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    usuario_id = request.cookies.get('usuario')
    
    cur.callproc('GET_USUARIOS', [empresa_id, usuario_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for usuario in rows:
        response["usuarios"].append({
            "id": usuario[0],
            "nombre": usuario[1],
            "apepat": usuario[2],
            "apemat": usuario[3],
            "correo": usuario[4],
            "rol": usuario[5],
            "foto": usuario[6],
            "activo": ord(usuario[7])
        })
    cur.close()
    return response

@app.route('/add_user/', methods=['POST'])
def crear_usuario():
    response = {}
    cur = mysql.connection.cursor()
    try:
        data = json.loads(request.data)
    except:
        data = json.loads(request.form['datos'])
    empresa_id = request.cookies.get('empresa') if request.cookies.get('empresa') is not None else data['EMPRESA_ID']
    arch = request.files['file']
    if not allowed_file(arch.filename):
        response['exito'] = False
        response['desc'] = "Sube un archivo de los permitidos"
        return response
    filename = secure_filename(str(int(datetime.now().timestamp())) + arch.filename)

    arch.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    query = ("INSERT INTO USUARIO (NOMBRE, APEPAT, APEMAT, ROL,"
    "FOTO, ACTIVO, EMPRESA_ID, CORREO, PASSWORD) VALUES ("
    + "'" + data['NOMBRE'] + "', "
    + "'" + data['APEPAT'] + "', "
    + "'" + data['APEMAT'] + "', "
    + "" + str(data['ROL']) + ", "
    + "'" + filename + "', "
    + "1, "
    + "'" + str(empresa_id) + "', "
    + "'" + data['CORREO'] + "', "
    + "sha2('" + data['PASSWORD'] + "', 512));"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response = {
        'exito': isinstance(last_id, int),
        'id_insertado': last_id
    }
    cur.close()
    return jsonify(response)

######################### INICIO USUARIO #####################

@app.route('/add_categoria/', methods=['POST'])
def crear_categoria():
    response = {}
    cur = mysql.connection.cursor()
    query = ("INSERT INTO CATEGORIA (NOMBRE,"
    "EMPRESA_ID) VALUES ("
    + "'" + request.form['NOMBRE'] + "', "
    + "'" + request.form['EMPRESA_ID'] + "');"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response = {
        'exito': isinstance(last_id, int),
        'id_insertado': last_id
    }
    cur.close()
    return jsonify(response)

################### INICIO PROD ######################
@app.route('/add_producto/', methods=['POST'])
def crear_producto():
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.form['datos'])
    arch = request.files['file']
    if not allowed_file(arch.filename):
        response['exito'] = False
        response['desc'] = "Sube un archivo de los permitidos"
        return response
    filename = secure_filename(str(int(datetime.now().timestamp())) + arch.filename)
    # filename = (str(int(datetime.now().timestamp())) + filename)
    arch.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    empresa_id = request.cookies.get('empresa')
    usuario_id = request.cookies.get('usuario')
    query = ("INSERT INTO PRODUCTO (USUARIO_ID, EMPRESA_ID, NOMBRE, DESCRIPCION,"
    "IMAGEN_REFERENCIA) VALUES ("
    + str(usuario_id) + ", "
    + str(empresa_id) + ", "
    + "\"" + data['NOMBRE'] + "\", "
    + "'" + data['DESCRIPCION'] + "', '" + filename + "')"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    for categoria in data['CATEGORIAS'][2:]:
        query = ("INSERT INTO categoria_producto (PRODUCTO_ID, CATEGORIA_ID)"
        " VALUES ("
        + str(last_id) + ","
        + categoria +
        ");"
        )
        cur.execute(query)
        mysql.connection.commit()
        rows = cur.fetchall()
    cur.close()
    return jsonify(response)


@app.route('/get_producto/<producto_id>', methods=['GET'])
def obtener_producto(producto_id):
    response = {}
    cur = mysql.connection.cursor()
    empresa_id = request.cookies.get('empresa')
    cur.callproc('GET_PRODUCTO', [producto_id, empresa_id])
    row = cur.fetchone()
    cur.close()
    if row:
        cur = mysql.connection.cursor()
        response['exito'] = True
        response['producto'] = {
            'id': row[0],
            'usr': row[1],
            'nombre': row[2],
            'desc': row[3],
            'imagen_referencia': row[4]
        }
        cur.callproc('GET_PRODUCTO_CATEG', [producto_id])
        rows = cur.fetchall()
        response['categorias'] = []
        for categ in rows:
            response['categorias'].append({
                'nombre': categ[0]
            })
        cur.close()
        cur = mysql.connection.cursor()
        query = ("SELECT * FROM ARMAR_INVENTARIO WHERE PRODUCTO_ID = " + str(producto_id))
        cur.execute(query)
        mysql.connection.commit()
        rows = cur.fetchall()
        response['inventario'] = []
        if len(rows) > 0:
            for inv in rows:
                response['inventario'].append({
                    'id': inv[1],
                    'serie': inv[2],
                    'folio': inv[3],
                    'unombre': inv[4],
                    'lat': inv[5],
                    'lon': inv[6],
                    'costo': inv[7],
                    'estado': inv[8],
                    'observaciones': inv[9],
                    'proveedor': inv[10],
                    'f_compra': inv[11],
                    'archivo_fac': inv[12]
                })
        cur.close()
    else:
        response['exito'] = False
        response['desc'] = "Dicho producto no existe."
    return jsonify(response)

################### FIN PROD ######################
################### INICIO INV ####################
@app.route('/add_inventario/<id_producto>', methods=['POST'])
def crear_inventario(id_producto):
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.form['datos'])
    arch = request.files['file']
    if not allowed_file(arch.filename):
        response['exito'] = False
        response['desc'] = "Sube un archivo de los permitidos"
        return response
    filename = secure_filename(str(int(datetime.now().timestamp())) + arch.filename)
    # filename = (str(int(datetime.now().timestamp())) + filename)
    arch.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    empresa_id = request.cookies.get('empresa')
    query = ("INSERT INTO INVENTARIO (PRODUCTO_ID, NSERIE, NFACTURA, UBICACION_ID, COSTO,"
    "ESTADO, OBSERVACIONES, PROVEEDOR, FECHA_COMPRA, FACTURA) VALUES ("
    + str(id_producto) + ", "
    "'"+ data['NSERIE'] + "', "
    "'"+ data['NFACTURA'] + "', "
    + data['UBICACION_ID'] + ", "
    + str(data['COSTO']) + ", "
    + data['ESTADO'] + ", "
    "'"+ data['OBSERVACIONES'] + "', "
    + data['PROVEEDOR'] + ", "
    "'"+ data['FECHA_COMPRA'] + "', "
    "'"+ filename + "'"
    ");"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    cur.close()
    cur = mysql.connection.cursor()
    query = ("SELECT * FROM ARMAR_INVENTARIO WHERE PRODUCTO_ID = " + str(id_producto))
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    response['inventario'] = []
    if len(rows) > 0:
        for inv in rows:
            response['inventario'].append({
                'id': inv[1],
                'serie': inv[2],
                'folio': inv[3],
                'unombre': inv[4],
                'lat': inv[5],
                'lon': inv[6],
                'costo': inv[7],
                'estado': inv[8],
                'observaciones': inv[9],
                'proveedor': inv[10],
                'f_compra': inv[11],
                'archivo_fac': inv[12]
            })
    cur.close()
    return jsonify(response)
################### FIN INV #######################
def count_pedidos_solcitudes():
    response = {}
    response["categorias"] = {}
    cur = mysql.connection.cursor()
    query = ("SELECT C.NOMBRE, COUNT(CA.CATEGORIA_ID) AS CONTEO FROM "
    "CATEGORIA_ACTIVO CA, CATEGORIA C, PRODUCTO P WHERE "
    " P.EMPRESA_ID = "+ + " "
    " AND CA.ACTIVO_ID = C.NOMBRE;"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    counter = 0
    for i in rows:
        response["categorias"][rows[i][0]] = rows[i][1]
        counter = counter + 1
    cur.close()
    return jsonify(response)


def detalle_articulo_inventario():
    response = {}
    response["detalles_producto"] = {}
    response["mantenimientos"] = {}
    response["consumibles"] = {}
    cur = mysql.connection.cursor()
    query = ("SELECT NOMBRE, IMAGEN_REFERENCIA FROM PRODUCTO WHERE ID = '" + request.args.get('id_producto') + "';")
    cur.execute(query)
    mysql.connection.commit()
    row = cur.fetchone()
    response["detalles_producto"] = {
        "nombre": row[0],
        "imagen": row[1]
    }
    query = ("SELECT NOMBRE, IMAGEN_REFERENCIA FROM PRODUCTO WHERE ID = '" + request.args.get('id_producto') + "';")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    response["detalles_producto"] = {
        "nombre": row[0],
        "imagen": row[1]
    }
    counter = 0
    for i in rows:
        response["categorias"][rows[i][0]] = rows[i][1]
        counter = counter + 1
    cur.close()
    return jsonify(response)


def get_mantenimientos():
    request = {}
    request["mantenimientos"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT PROVEEDOR_MTTO, COSTO, DESCRIPCION, F_INICIO, F_FINAL"
    " FROM MANTENIMIENTO WHERE INVENTARIO_ID = '" + request.args.get("id_inv")
    + "';"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    counter = 0
    for i in rows:
        query = ("SELECT RAZSOC FROM EMPRESA WHERE ID = " + i[0]
        )
        cur.execute(query)
        mysql.connection.commit()
        row = cur.fetchone()
        response["mantenimientos"][counter] = {
            "proveedor": row[0],
            "costo": i[1],
            "descripcion": i[2],
            "f_inicio": i[3],
            "f_final": i[4]
        }
        counter = counter + 1
    cur.close()
    return jsonify(request)


@app.route('/')
def angular_root():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, threaded=True, port=8888)
