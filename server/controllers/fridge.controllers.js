const {FoodTemplate, Food} = require("../models/food.model")

const fridge = {
    // Todos los alimentos  de un mismo usuario
    // getFood: async (req, res) => {
    //     const infoTareas = await tareaModel.find({ idUsuario: req.body.idUsuario });
    //     res.json(infoTareas);
    // },
    //  Carga las plantillas de los  alimentos
    getTemplates: async (req, res) => {
            const infoTemplates = await FoodTemplate.find({});
            res.json(infoTemplates);
        // let result = Food.find({}).exec((error, result) => {
        //     if (error || !result) {
        //         return res.status(404).json({   
        //             status: "error",
        //             mensaje: "Your fridge is empty, try to add some food",
        //         })
        //     }
        // })
        // return res.status(200).send({
        //     status: "success",
        //     result
        // })
    },
    addFood: async (req, res) => {
        // conn.open();
        const  parameters = req.body;
        let newFood = new Food(parameters);
        
        newFood.save((error, result) => {
            if (error || !result) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "No se ha guardado el articulo",
                    newFood
                })
            }
            return res.status(200).json({
                status: "success",
                mensaje: "Lo has guardado en la BD",
                id : result.id
            })
        });
        // conn.close();
        
    },
    getOne: async (req, res) => {
        let params_food_name = req.params.name;
        let food_name = (params_food_name.charAt(0).toUpperCase() + params_food_name.slice(1)).replaceAll('-', ' ')
        const foodFile = await FoodTemplate.findOne({ Name : food_name })           
        res.json(foodFile)
    },
    getMany : async (req, res) => {
        const ids =  req.body
        const user_food = await Food.find().where('_id').in(ids).exec()
        res.json(user_food)
    }
    // insertFood: async (req, res) => {
    //     const { idUsuario, nombreTarea } = req.body;
    //     let info = { idUsuario, nombreTarea };
    //     const insertTareas = await tareaModel.create(info);
    //     res.json(insertTareas);
    // },
    // deleteFood: async (req, res) => {
    //     const { nombreTarea } = req.body;
    //     const deleteTarea = await tareaModel.deleteOne({ nombreTarea });
    //     res.json(deleteTarea);
    // },
    // updateFood: async (req, res) => {
    //     const { id, nombreTarea } = req.body;
    //     let filter = { _id: id };
    //     let update = { nombreTarea };
    //     const updateTarea = await tareaModel.findByIdAndUpdate(filter, update);
    //     res.json(updateTarea);
    // },
};

module.exports = fridge;