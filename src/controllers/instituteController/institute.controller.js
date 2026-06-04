import pool from '../../config/db.js';
import Product from "../../models/Product.js";
import uploadFilesToCloudinary from "../../utils/uploadFilesToCloudinary.js";


/********** get all product controller is here **********/
const getAllInstitutes = async (req, res) => {


  try {

    const query = `
            SELECT 
                id,
                name,
                age,
                lan
            FROM users
            ORDER BY id DESC
        `;

    const [rows] = await pool.query(query);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });



  } catch (error) {

    console.error('Get Institutions Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch institutions.'
    });
  }

};










/********** get single product controller is here **********/
const getSingleInstitute = async (req, res) => {

  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || id.length !== 3) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }


    // Find product by ID
    const query = `
            SELECT 
                id,
                name,
                age,
                lan
            FROM users
            WHERE id = ?
            ORDER BY id DESC
        `;

    const [rows] = await pool.query(query, [id]);



    const product = rows;


    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }






    // Return the product
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({
      success: false,
      error: "Something went wrong while fetching the product!",
    });
  }

};









/********** create institute controller is here **********/
const createInstitute = async (req, res) => {

  // request body data, come from client side
  const { id, name, age, lan } = req.body;



  console.log("Received data:", { id, name, age, lan });


  // create a collection oobject
  let connection;

  try {

    // get spacific connection from the pool
    connection = await pool.getConnection();

    /*** ACID - ATOMICITY STARTS HERE ***/
    await connection.beginTransaction();


    // insert institution data into institutions table
    const institutionQuery = `
            INSERT INTO users (id,name,age,lan) 
            VALUES (?, ?, ?, ?)
        `;
    const [institutionResult] = await connection.query(institutionQuery, [id, name, age, lan]);

    const newInstitutionId = institutionResult.insertId;


    // insert audit log into activity_logs table
    // const logQuery = `
    //         INSERT INTO activity_logs (user_id, target_id, action, changes) 
    //         VALUES (?, ?, ?, ?)
    //     `;
    // const logData = JSON.stringify({ action: 'CREATED', entity: 'Institution', name });

    // await connection.query(logQuery, ["USD-1", newInstitutionId, 'CREATE', logData]);


    /*** ACID - DURABILITY & CONSISTENCY ***/
    await connection.commit();

    // send success response to client
    res.status(201).json({
      success: true,
      message: "Institution and audit log created successfully (ACID Compliant).",
      data: { id: newInstitutionId }
    });

  } catch (error) {

    /*** ACID - ROLLBACK ***/
    if (connection) {
      await connection.rollback();
    }

    console.error("Transaction Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create institution. Database rolled back to ensure consistency."
    });

  } finally {
    /*** Memory Management ***/
    if (connection) {
      connection.release();
    }
  }
};





/********** Update  institute controller is here **********/
const updateInstitute = async (req, res) => {


  try {

    const { id } = req.params;

    // Validate product ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }



    const { ProductTitle, brand, shortdes, product_price, gender, weight, meterial, fType, fShape, lensWidth, lensHeight, BridgeWidth, ArmLength, product_Discription, product_Images } = req.body;


    const pt_Images = await uploadFilesToCloudinary(product_Images);

    const value = {
      ProductTitle,
      brand,
      shortdes,
      product_price,
      gender,
      weight,
      meterial,
      fType,
      fShape,
      lensWidth,
      lensHeight,
      BridgeWidth,
      ArmLength,
      product_Discription,
      product_Images: pt_Images,
    };



    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, value, {
      new: true, // return updated document
      runValidators: true, // enforce schema validation
    });



    //If not found
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }


    //Success response
    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });


  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the product.",
    });
  }


};










/********** Delete  institute controller is here **********/
const deleteInstitute = async (req, res) => {


  try {


    const { id } = req.params;

    // Validate product ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }



    // Attempt to delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);



    //If no product found
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }



    //Success response
    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: deletedProduct,
    });


  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the product.",
    });
  }


};








/*********** modules export from here ************/
export { createInstitute, deleteInstitute, getAllInstitutes, getSingleInstitute, updateInstitute };

