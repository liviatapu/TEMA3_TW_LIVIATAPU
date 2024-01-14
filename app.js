import express from 'express'
import Sequelize from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'my.db'
})

let FoodItem = sequelize.define('foodItem', {
    name : Sequelize.STRING,
    category : {
        type: Sequelize.STRING,
        validate: {
            len: [3, 10]
        },
        allowNull: false
    },
    calories : Sequelize.INTEGER
},{
    timestamps : false
})


const app = express();
// TODO

app.use(express.json());
const foodItems = [];


  
  

  


app.get('/create', async (req, res) => {
    try{
        await sequelize.sync({force : true})
        for (let i = 0; i < 10; i++){
            let foodItem = new FoodItem({
                name: 'name ' + i,
                category: ['MEAT', 'DAIRY', 'VEGETABLE'][Math.floor(Math.random() * 3)],
                calories : 30 + i
            })
            await foodItem.save()
        }
        res.status(201).json({message : 'created'})
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})
    }
})

app.get('/food-items', async (req, res) => {
    try{
        let foodItems = await FoodItem.findAll()
        res.status(200).json(foodItems)
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})        
    }
})

app.post('/food-items', async (req, res) => {
    try{
        if(!req.body) {
            return res.status(400).json({ message: 'body is missing' });
        // TODO
    }
    const { name, category, calories } = req.body;
    if (!name || !category || calories === undefined) {
        return res.status(400).json({ message: 'inccorect request' });
    }
    if (calories < 0) {
        return res.status(400).json({ message: 'calories should be a positive'});
    }
    

    const validCategories = ['DAIRY', 'FRUITS', 'VEGETABLES', 'MEAT', 'FISH', 'OTHER'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'not a valid category' });
    }

    // Adaug elementul alimentar în lista foodItems
    foodItems.push({ name, category, calories });

    
    res.status(201).json({ message: 'created' });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
   }
});     
    

export default app