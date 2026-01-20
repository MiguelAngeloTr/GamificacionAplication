

//peticion para obtener todas las evidencias
export const getEvidencias = async (req, res) => {
    try {

        const [result] = await pool.query("SELECT * from evidencias")

        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

//peticion para obtener una evidencia en especifico
export const getEvidencia = async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * from evidencias WHERE id = ?", [
            req.params.id,
        ]);

        if (result.length === 0)
            return res.status(404).json({ message: "Evidencia no encontrada" });

        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


//query para actulizar una evidencia
export const updateEvidencia = async (req, res) => {
    try {
        const [result] = await pool.query("UPDATE evidencias SET ? WHERE id = ?", [req.params.id])

        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

//query para eliminar una evidencia en especifico
export const deleteEvidencia = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE from evidencias WHERE id =?", [req.params.id])

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "No se encontro la evidencia" });

        return res.sendStatus(204)

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }

}