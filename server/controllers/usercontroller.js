export const getuserdata = async (req, res) => {
    try {
        const role = req.user.role;
        const recentsearchedcities = req.user.recentsearchedcities;
        res.json({
            success: true,
            role,
            recentsearchedcities
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}










export const storerecentsearchedcities = async (req, res) => {
    try {
        const { recentsearchedcity } = req.body;
        const user = await req.user;
        user.recentsearchedcities.push(recentsearchedcity);
        if (user.recentsearchedcities.length > 3)
            user.recentsearchedcities.shift();
        await user.save();
        res.json({
            success: true,
            message: 'City added'
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}