"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Actividad_1 = require("../models/Actividad");
class ActividadRouter {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    //ver todas las actividades
    GetActividades(req, res) {
        Actividad_1.default.find({})
            .then((data) => {
            let status = 200;
            if (data == null) {
                status = 404;
            }
            res.statusCode = status;
            res.json(data);
        })
            .catch((err) => {
            const status = 500;
            res.json(err);
        });
    }
    //ver actividad segun propietario
    GetActividadesPropietario(req, res) {
        const propietario = req.params.propietario;
        Actividad_1.default.find({ "propietario": propietario })
            .then((data) => {
            let status = 200;
            if (data == null) {
                status = 404;
            }
            res.statusCode = status;
            res.json(data);
        })
            .catch((err) => {
            res.statusCode = 500;
            res.json(err);
        });
    }
    //ver una actividad
    GetActividad(req, res) {
        //const id: number = req.params.id;
        const titulo = req.params.titulo;
        Actividad_1.default.findOne({ "titulo": titulo })
            .then((data) => {
            let status = 200;
            if (data == null) {
                status = 404;
            }
            res.statusCode = status;
            res.json(data);
        })
            .catch((err) => {
            res.statusCode = 500;
            res.json(err);
        });
    }
    GetActividadPropietario(req, res) {
        //const id: number = req.params.id;
        const titulo = req.params.titulo;
        const propietario = req.params.propietario;
        Actividad_1.default.findOne({ "titulo": titulo, "propietario": propietario })
            .then((data) => {
            let status = 200;
            if (data == null) {
                status = 404;
            }
            res.statusCode = status;
            res.json(data);
        })
            .catch((err) => {
            res.statusCode = 500;
            res.json(err);
        });
    }
    //ver si esta actividad ya existe para el mismo ususario
    //miramos si hay ya una 
    ComprobarActividad(titulo, propietario, callback) {
        //p=:promise<err,Actividad>
        //p.then(........) dentro pongo lo que quiero ejecutar
        //p.catch(......) para error
        Actividad_1.default.findOne({ "titulo": titulo, "propietario": propietario })
            .then((data) => {
            callback(null, data);
            return;
        })
            .catch((err) => {
            return callback(err, null);
        });
    }
    AddComment(req, res) {
        //const id: number = req.params.id;
        const titulo = req.params.titulo; // pasar el titulo de la actividad por parametros
        const comment = req.body; // Pasar el comentario por el body
        console.log(titulo, comment);
        Actividad_1.default.findOneAndUpdate({ titulo: titulo }, {
            $push: {
                comments: {
                    $each: [{
                            user: comment.user,
                            comment: comment.comment,
                            rating: comment.rating
                        }]
                }
            }
        }, { new: true }).then((data) => {
            let status = 200;
            console.log('este', data);
            if (data == null) {
                status = 404;
            }
            res.statusCode = status;
            res.json(data);
        })
            .catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.json(err);
        });
    }
    //crear una actividad
    CrearActividad(req, res) {
        const titulo = req.body.titulo;
        const descripcion = req.body.descripcion;
        let estrellas = req.body.estrellas;
        //if (estrellas==null){
        //    estrellas=0;
        //}
        const tags = req.body.tags;
        const propietario = req.body.propietario;
        const actividad = new Actividad_1.default({
            titulo,
            descripcion,
            estrellas,
            tags,
            propietario
        });
        Actividad_1.default.findOne({ "titulo": titulo, "propietario": propietario })
            .then((data) => {
            if (data == null) {
                actividad.save()
                    .then((data) => {
                    //hemos podido crear la actividad
                    res.statusCode = 200;
                    res.json(data);
                })
                    .catch((err) => {
                    //error al crear
                    res.statusCode = 404;
                    res.json(err);
                });
            }
            else {
                //Actividad ya existe
                res.json({
                    data: null
                });
            }
        })
            .catch((err) => {
            //error en la busqueda
            res.statusCode = 404;
            res.json(err);
        });
        //este funciona sin comprobar, va creando el mismo tantas veces como quieres
        /*
        actividad.save()
                    .then((data) => {
                        res.statusCode = 200;
                        res.json({
                            data
                        });
                    })
                    .catch((err) => {
                        res.statusCode = 404;
                        res.json({
                            err
                        });
                    })
        */
    }
    //modificar actividad
    ModificarActividad(req, res) {
        const title = req.params.title;
        const titulo = req.body.titulo;
        const descripcion = req.body.descripcion;
        const estrellas = req.body.estrellas;
        const tags = req.body.tags;
        const propietario = req.body.propietario;
        console.log(titulo);
        console.log(title);
        console.log(propietario);
        Actividad_1.default.findOneAndUpdate({ "titulo": title, "propietario": propietario }, { $set: { "titulo": titulo, "descripcion": descripcion, "estrellas": estrellas, "tags": tags, "propietario": propietario } })
            .then((data) => {
            res.statusCode = 200;
            res.json(data);
        })
            .catch((err) => {
            res.statusCode = 404;
            res.json(err);
        });
    }
    //Borrar actividad
    BorrarActividad(req, res) {
        const titulo = req.params.titulo;
        const propietario = req.params.propietario;
        Actividad_1.default.findOneAndDelete({ "titulo": titulo, "propietario": propietario })
            .then((data) => {
            const status = 200;
            res.json(data);
        })
            .catch((err) => {
            const status = 404;
            res.json(err);
        });
    }
    //@ts-ignore
    routes() {
        //@ts-ignore
        this.router.get('/', this.GetActividades);
        this.router.get('/:titulo', this.GetActividad);
        this.router.get('/propietario/:propietario', this.GetActividadesPropietario);
        this.router.get('/pidiendo/:propietario/:titulo', this.GetActividadPropietario);
        this.router.post('/', this.CrearActividad);
        this.router.post('/addComment/:titulo', this.AddComment);
        this.router.put('/update/:title', this.ModificarActividad);
        this.router.delete('/:propietario/:titulo', this.BorrarActividad);
    }
}
//export
//@ts-ignore
const actividadRoutes = new ActividadRouter();
actividadRoutes.routes();
exports.default = actividadRoutes.router;
//# sourceMappingURL=ActividadRouter.js.map