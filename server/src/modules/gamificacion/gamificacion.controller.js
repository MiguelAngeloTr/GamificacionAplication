
//peticion para obtener todas las recompensas personalizables
export const getRewards = async (req, res) => {
    try {

        const [result] = await pool.query("SELECT * from recompensas")
        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

//query para actulizar el estado/preferencia de las recompensas
export const updateRewards = async (req, res) => {
    try {
        const [result] = await pool.query("UPDATE recompensas SET ? WHERE id = ?", [req.body, req.params.id])

        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}



//peticion para obtener todas las puntuaciones
export const getPoints = async (req, res) => {
    try {

        const [result] = await pool.query("SELECT * from puntuaciones ")
        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


//query para actulizar la cantidad de puntos 
export const updateLevels = async (req, res) => {
    try {
        const [result] = await pool.query("UPDATE niveles SET num_nivel = num_nivel +  1 WHERE id = ?", [req.params.id])

        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


   //peticion para obtener una actividad en especifico
    export const getPoint = async (req, res) => {
        try {
            const [result] = await pool.query("SELECT * from puntuaciones WHERE id = ?", [
                req.params.id,
            ]);

            if (result.length === 0)
                return res.status(404).json({ message: "puntuacion no encontrada" });

            res.json(result[0]);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }


    
//query para eliminar una unidad especifica
export const deletePoint = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE from puntuaciones WHERE id =?", [req.params.id])

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "No se encontro la puntuacion" });

        return res.sendStatus(204)

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }

}

//query para eliminar una unidad especifica
export const deleteLevel = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE from niveles WHERE id =?", [req.params.id])

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "No se encontro el nivel" });

        return res.sendStatus(204)

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }

}