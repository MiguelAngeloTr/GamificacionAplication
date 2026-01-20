
//Solicitudes http para el manejo de las unidades retorno

//peticion para obtener todas las unidades
export const getUnits = async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * from unidades_retorno")
        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

//peticion para obtener una unidad en especifico
export const getUnit = async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * from unidades_retorno WHERE id = ?", [
            req.params.id,
        ]);

        if (result.length === 0)
            return res.status(404).json({ message: "unidad no encontrada" });

        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


//query para crear una nueva unidad
export const createUnit = async (req, res) => {
    try {
        const {
            nombre,
            objetivo,
            archivo,
            descripcion,
            nota,
            fecha
        } = req.body

        const [result] = await pool.query(
            "INSERT INTO unidades_retorno(nombre, objetivo, archivo, descripcion, nota, fecha) VALUES (?,?,?,?,?,?)",
            [nombre, objetivo, archivo, descripcion, nota, fecha]
        )


        res.json({
            id: result.insertId,
            nombre,
            objetivo,
            archivo,
            descripcion,
            nota,
            fecha
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//query para actulizar una unidad especifica
export const updateUnit = async (req, res) => {
    try {
        const [result] = await pool.query("UPDATE unidades_retorno SET ? WHERE id = ?", [req.body, req.params.id])

        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


//query para eliminar una unidad especifica
export const deleteUnit = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE from unidades_retorno WHERE id =?", [req.params.id])

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "No se encontro la unidad" });

        return res.sendStatus(204)

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }

}

