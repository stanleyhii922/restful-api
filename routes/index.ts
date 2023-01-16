import { Express } from "express";
import { forEach, sortBy } from "lodash";
import { getMethod } from "../http-handler";

export const registerRoutes = (app:Express) =>{
    app.get('/check-server', (req,res) => {
        try{
            res.send({
                message:"Server is running",
                env:process.env.NODE_ENV,
                port:process.env.PORT,
            });
        }catch(err){
            res.send({
                status:"Server Error",
                message:"Error: "+ err
            });
        }
    });

    app.get('/ordered-posts',async (req, res)=>{
        try{
            let posts:any = await getMethod("https://jsonplaceholder.typicode.com/posts");
            let comments:any = await getMethod("https://jsonplaceholder.typicode.com/comments"); 

            // const groupByPostId = comments.reduce((group:any, comment:any) => {
            //     const { postId } = comment;
            //     group[postId] = group[postId] ?? [];
            //     group[postId].push(comment);
            //     return group;
            //   }, {});

            posts = posts.map((val:any)=>{
                var totalComments = 0;

                forEach(comments,(comment,key)=>{
                    if(comment.postId === val.id){
                        totalComments +=1;
                    }
                });

                //NOTE: for grouping way
                // totalComments = groupByPostId[val.id].length;
                // console.log("Check Length", totalComments);
                return{
                    post_id:val.id,
                    post_title:val.title,
                    post_body:val.body,
                    total_number_of_comments:totalComments
                }
            })

            posts = sortBy(posts, ['total_number_of_comments', 'post_id']);
            
            res.send({
                status:"SUCCESS",
                data:posts
            })
        }catch(err){
            console.log("Error Occured: ",err);
            res.send({
                status:"FAIL"
            })
        }
    });

    app.get('/filtered-comments',async (req,res)=>{
        try{

            var queryPostId = req.body?.postId ?? null ;
            var queryId = req.body?.id ?? null ;
            var queryName = req.body?.name ?? null ;
            var queryEmail = req.body?.email ?? null ;
            var queryBody = req.body?.body ?? null ;

            const filterFunction = (val:any)=>{
                var finalQuery = true; 
                if(queryPostId && val.postId !== queryPostId){
                    finalQuery = false;
                }
                if(queryId && val.id !== queryId){
                    finalQuery = false;
                }
                if(queryName && val.name !== queryPostId){
                    finalQuery = false;
                }
                if(queryEmail && val.email !== queryEmail){
                    finalQuery = false;
                }
                if(queryBody && !(val.body.includes(queryBody))){
                    finalQuery = false;
                }
                return finalQuery
            }
            let comments:any = await getMethod("https://jsonplaceholder.typicode.com/comments"); 

            comments = comments.filter((val:any)=>{
                return filterFunction(val);
            })
            
            if(comments.length>0){
                res.send({
                    status:"SUCCESS",
                    data:comments
                })
            }else{
                res.send({
                    status:"DATA NOT EXISTED",
                })
            }
            
        }catch(err){
            console.log("Error Occured: ",err);
            res.send({
                status:"FAIL"
            })
        }
    });
}