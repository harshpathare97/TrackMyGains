import { authenticate } from "../../../lib/middleware/auth";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../../../models/User"; 
import connectToMongoDB from '../../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET ;

export const GET = authenticate(async (req) => {
  try {
  await connectToMongoDB();
  const user = await User.findById( req.user.id ).select("-password")
  
  return new Response(JSON.stringify({message: "Fetch User Successfully", user}),{ status: 200 });
} catch (error) {
  console.error(error);
  return new Response(JSON.stringify({ error: "Internal server error. Please try again later." }), { status: 500 });
}
});

export async function POST(req) {
    const { name, email, password } = await req.json();
    let success = true
    
    try {
      await connectToMongoDB();
      // Check if the user already exists
      const user = await User.findOne({ email });
      if (user) {
        return new Response(JSON.stringify({ error: "User already exists" }),{status:400});
      }
  
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
  
      // Create a new user with the hashed password
      const newUser = new User({ name, email, password:secPass });
      await newUser.save(); 
  
      const data = { id: newUser.id }; 
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true
      return new Response(JSON.stringify({ message: "User created successfully", authtoken,success }),{status:200});
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal server error. Please try again later." }),{status:500});
    }
  };

export async function PUT(req) {
    const { email, password } = await req.json();
    let success = true
  
    try {
      await connectToMongoDB();
      // Find the user by email
      const user = await User.findOne({ email });
  
      // If the user doesn't exist
      if (!user) {
        success = false
        return new Response(JSON.stringify({ error: "Invalid email or password" }),{status:401});
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
  
      if (!passwordCompare) {
        success = false
        return new Response(JSON.stringify({ error: "Invalid email or password" }),{status:401});
      }
  
      const data = { id: user.id };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true
      return new Response(JSON.stringify({message: "Logged in Successfully", authtoken, success }),{status:200}); // Send the token to the client
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal server error. Please try again later." }),{status:500});
    }
  };