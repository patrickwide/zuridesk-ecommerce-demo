import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import categories from './data/categories.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import connectDB from './config/database.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Create users
    const createdUsers = await User.insertMany(
      users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 10)
      }))
    );

    const adminUser = createdUsers[0]._id;

    // Create categories
    const createdCategories = await Category.insertMany(categories);

    // Create category map for easy lookup
    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.slug] = category._id;
      return map;
    }, {});

    // Add admin user and category references to products
    const sampleProducts = products.map(product => ({
      ...product,
      user: adminUser,
      category: categoryMap[product.categorySlug] // We'll update products.js to include categorySlug
    }));

    await Product.insertMany(sampleProducts);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}