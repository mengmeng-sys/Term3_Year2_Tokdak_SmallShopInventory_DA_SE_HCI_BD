const productService = require('../services/product.service');
//for export the data (products)
const {createObjectCsvStringifier} = require('csv-writer');
//for import 
const fs = require('fs');
const csv = require('csv-parser');
const { createTracing } = require('trace_events');

const create = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            shop_id: req.shop_id // always comes from middleware, NEVER from req.body
        };

        const result = await productService.create(productData);
        res.status(201).json({ message: 'Product created successfully', data: result });
    } catch (err) {
        next(err);
    }
};

const getAll = async (req, res, next) =>{
     try{
        const filters ={
              search:req.query.search,
              category_id: req.query.category_id,
              sort:req.query.sort // it can be 'quantity_asc' ,'quantity_desc'             
        }
        const products = await productService.getAll(req.shop_id,filters);
        // console.log(products);
        res.status(200).json({
            data:products
        })

     }catch(error){
        res.status(500).json({
            message:error.message
        })
     }
};

const getById = async (req, res, next) => {
    try {
        const product = await productService.getById(req.params.id, req.shop_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product fetched successfully', data: product });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res) => {
     try {
         await productService.update(
               req.params.id,
               req.shop_id,
               req.body
         );

         res.status(200).json({
             message : 'Product updated successfully'
         });

     }catch(error){

         res.status(500).json({
            message: error.message     
         });

     }
};

const remove = async (req, res) =>{
     try{
         await productService.remove(req.params.id , req.shop_id);

         res.status(200).json({
          message:'Product deleted successfully'
         });

     }catch(error){
          res.status(500).json({
              message:error.message
          });
     }
};
const exportProducts = async (req, res, next)=>{
 try {
     const products = await productService.getAll(req.shop_id, {});
     const csvStringifier = createObjectCsvStringifier({
          header:[
                { id: 'name', title: 'Name' },
                { id: 'category_name', title: 'Category' },
                { id: 'price', title: 'Price' },
                { id: 'current_quantity', title: 'Current Quantity' },
                { id: 'min_quantity', title: 'Minimum Quantity' },
                { id: 'unit', title: 'Unit' }
          ]
     });
     const csvHeader = csvStringifier.getHeaderString();
     const csvBody = csvStringifier.stringifyRecords(products);
     res.setHeader('Content-Type', 'text/csv');
     res.setHeader('Content-Disposition', 'attachment; filename=products_export.csv');
     res.status(200).send(csvHeader + csvBody);

 }catch(err){
  next(err);
 }
};

const importProducts = async (req, res, next) =>{
     try {
         if(!req.file){
              return res.status(400).json({message:'No file uploaded'});
         }
         const results = [];
         fs.createReadStream(req.file.path)
           .pipe(csv())
           .on('data',(row) => results.push(row))
           .on('end', async ()=>{
                try{
                    const created = await productService.bulkImport(req.shop_id, results);
                    fs.unlinkSync(req.file.path); // delete temp file after proccessing
                    res.status(201).json({
                        message:`${create.length} products imported successfully`,
                        data:created
                    });
                }catch(err){
                   next(err);
                };
           });

     }catch (err){
         next(err);
     };
};


module.exports ={
       create,
       getAll,
       getById,
       update,
       remove,
       exportProducts,
       importProducts
     }  