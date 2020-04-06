"use strict";
const Inquest = require("../models/inquest");

function addInquest(req, res) {
  let inquest = new Inquest();
  let params = req.body;

  if (params.title && params.description) {
    inquest.title = params.title;
    inquest.description = params.description;
    inquest.opinion = {
      yes: 0,
      no: 0,
      maybe: 0,
      usersOpined: []
    };
    inquest.user = req.user.sub;
    inquest.save((err, inquestSaved) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Error on the request of Inquest" });

      if (!inquestSaved)
        return res
          .status(400)
          .send({ message: "Error! The inquest cannot added" });

      return res.status(200).send({ inquest: inquestSaved });
    });
  } else {
    res.status(200).send({ message: "Fill all the data needed" });
  }
}

function kindOpinion(req, res, vote = "") {
  let inquestId = req.params.id;
  let userOpinion = true;
  let finalVote = `opinion.${vote}`

  Inquest.findById(inquestId, (err, inquestFounded)=>{
      if (err) return res.status(500).send({message: 'Error on the request of the inquest'})
      if(!inquestFounded) return res.status(404).send({message: 'Error to list the inquests'})
      for (let x = 0; x < inquestFounded.opinion.usersOpined.length; x++) {
          if (inquestFounded.opinion.usersOpined[x] === req.user.sub) {
              userOpinion = false
              return res.status(500).send({message: 'This user already opined, please change user to vote'})
          }
          
      }
      if (userOpinion === true) {
          Inquest.findByIdAndUpdate(inquestId, {$inc: {[finalVote]: 1}}, {new:true},(err,opinionUpdated)=>{
              if (err) return res.status(500).send({message: 'Error on the reques of Inquest'})
              if (!opinionUpdated) return res.status(404).send({message: 'Error to send your opinion'})
              opinionUpdated.opinion.usersOpined.push(req.user.sub)
              opinionUpdated.save()
              return res.status(200).send({opinion: opinionUpdated})
            })
      }
    })

}

function finalUserOpinion(req,res){
    let opinion = req.body.opinion.toLowerCase();
    if (opinion == 'yes' || 'no' || 'maybe'){
        kindOpinion(req,res, opinion)
    }else{
        res.status(400).send({message: 'Please try again, You only can use the options: YES, NO, MAYBE'})
    }

}

function commentInquest(req,res){
  let inquestId = req.params.id
  let params = req.body
  
  Inquest.findByIdAndUpdate(inquestId, {$push: {commentList: {comment: params.comment, commentUser: req.user.sub}}}, {new: true},(err, commentAdded)=>{
    if(err) return res.status(500).send({message: 'Error in the request of the comment'})
    if (!commentAdded) return res.status(404).send({message: 'Error to save the comment'})
    return res.status(200).send({commentAdded}) 
  })
}
function updateComment(req,res){
  let inquestId = req.params.inquestId
  let commentId = req.params.commentId
  let params = req.body

  
  Inquest.findOneAndUpdate({_id: inquestId, 'commentList._id': commentId}, {'commentList.$.comment': params.comment}, {new: true}, (err,commentUpdated)=>{
    if(err) return res.status(500).send({message:'Error in the request of the inquest'})
    if(!commentUpdated) return res.status(404).send({message: 'Commet is empty, please try again'})
    return res.status(200).send({commentUpdated})
  })
}

function deleteComment(req,res){
  let commentId = req.params.commentId
    Inquest.findOneAndUpdate({'commentList._id':commentId},{$pull: {commentList: {_id: commentId}}},(err,documentRemoved)=>{
      if(err) return res.status(500).send({message: 'Fatal server error, please try again'})
      if(!documentRemoved) return res.status(404).send({message: 'Comment doesnt found'})
      return res.status(200).send({documentRemoved})
    })
}
module.exports = {
  addInquest,
  finalUserOpinion,
  commentInquest,
  updateComment,
  deleteComment
};
