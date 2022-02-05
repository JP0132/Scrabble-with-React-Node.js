exports.calculateMove = (req, res) => {
    console.log("Calculating Move");
    console.log(req.body.rack);
    res.json({
        "hello":"chris"
    })
}