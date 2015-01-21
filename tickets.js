Products = new Mongo.Collection("products");
Features = new Mongo.Collection("features");
Comments = new Mongo.Collection("comments");
Roadmap = new Mongo.Collection("roadmap");
Documentation = new Mongo.Collection("documentation");

S3.config = {
    key: 'AKIAJHXBIES44SUBPGHA',
    secret: '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',
    bucket: 'threadline'
};


if (Meteor.isClient) {
$(document).ready(function(){
if(Meteor.user() === null){
$('a#login-sign-in-link').click()
}
});
Router.route('/add-feature', function () {
  this.render('add-feature');
});
Router.route('/add-feature/:parent', function () {
  this.render('add-feature');
  FeatureProject = this.params.parent;
});
Router.route('/add-roadmap/:parent', function () {
  this.render('add-roadmap');
  RoadmapParent = this.params.parent;
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/features', function () {
  this.render('features');
});


Router.route('/products', function () {
  this.render('products');
});
Router.route('/add-product', function () {
  this.render('add-product');
});

Router.route('/documentation', function () {
  this.render('documentation');
});
Router.route('/documentation/:_id', function () {
  this.render('documentation_detail');
  DocumentationID = this.params._id;
});
Router.route('/add-documentation/:product', function () {
  this.render('add-documentation');
    ProductIdentifier = this.params.product;
});

Router.route('/features/:_id', function () {
  this.render('featuredetail');
  FeatureID = this.params._id;
});
Router.route('/dash/:email', function () {
  this.render('dashboard');
  UserEmail = this.params.email;
});

Router.route('/products/:_id', function () {
  this.render('productdetail');
  ProductID = this.params._id;
});


Template.featuredetail.helpers({
    "featuredetail": function(){
        return Features.find({_id:FeatureID});
    }
})

Template.productdetail.helpers({
    "productdetail": function(){
        return Products.find({_id:ProductID});
    }
})
Template.productdetail.helpers({
    "completed_features": function(){
        return Features.find({'feature_project':ProductID,'feature_status':'Complete'});
    }
})

Template.productdetail.helpers({
    "productfeatures": function(){
        return Features.find({'feature_project':ProductID},{sort:{_id:-1}});
    }
})

Template.navbar.helpers({
    "reviewreadycount": function(){
        return Features.find({'feature_status':'Review Ready'}).count();
    }
})




Template.features.helpers({
    "features": function(){
        return Features.find();
    }
})

Template.dashboard.helpers({
    "dash_tickets": function(){
        return Features.find({feature_assignee:UserEmail});
    }
})
Template.navbar.helpers({
    "ticket_count": function(){
        return Features.find({feature_assignee:Meteor.user().services.google.email}).count();
    }
})


Template.featuredetail.helpers({
    "comments": function(){
        return Comments.find({parentid:FeatureID});
    }
})
Template.productdetail.helpers({
    "comments": function(){
        return Comments.find({parentid:ProductID});
    }
})
Template.products.helpers({
    "products": function(){
        return Products.find({});
    }
})
Template.productdetail.helpers({
    "roadmap": function(){
        return Roadmap.find({roadmap_parent:ProductID});
    }
})
Template.productdetail.helpers({
    "documentation": function(){
        return Documentation.find({parent:ProductID});
    }
})
Template.documentation_detail.helpers({
    "singledocumentation": function(){
        return Documentation.find({_id:DocumentationID});
    }
})
Template.navbar.helpers({
    "products": function(){
        return Products.find({});
    }
})
Template.home.helpers({
    "product_index": function(){
        return Products.find({});
    }
})

Template.s3_tester.events({
    "click button.upload": function(){
        var files = $("input.file_bag")[0].files
        S3.upload(files,"/headshot",function(e,r){
            ThePic = r
            console.log(ThePic.url)
            $('.thefile:first').attr('data-file',ThePic.url)
            $(".file_bag,.hideafterupload").hide();
            $('.partthree').toggleClass('in')
            userPics.insert({
              userid:Meteor.user().services.facebook.id,
              userpic:ThePic.url,
              date:new Date(),
              user_display_name:Meteor.user().services.facebook.name,
              user_fb_link:Meteor.user().services.facebook.link,
              user_gender:Meteor.user().services.facebook.gender,
              user_email:Meteor.user().services.facebook.email,
              session_id:sessionID,
              session_title:$('.session_title').val(),
              session_instructions:$('.session_description').val(),
              designer_id:'pending',
              designer_name:'pending',
              designer_pic:'pending',
              designer_email:'pending',
              designer_pay:1,
              job_gross:10,
              job_net:9,
              ticket_status:'new',
              delivery_1:'https://s3.amazonaws.com/f.cl.ly/items/2Z3j2a1h0U1e2n433r0n/Screen%20Shot%202015-01-10%20at%204.02.57%20PM.png',
              delivery_2:'https://s3.amazonaws.com/f.cl.ly/items/2Z3j2a1h0U1e2n433r0n/Screen%20Shot%202015-01-10%20at%204.02.57%20PM.png',
              delivery_3:'https://s3.amazonaws.com/f.cl.ly/items/2Z3j2a1h0U1e2n433r0n/Screen%20Shot%202015-01-10%20at%204.02.57%20PM.png',

            })
            $('.photoupload').fadeOut()
            $('.finalimage').attr('src',ThePic.url)

// $('.progress').each(function(){
// var TheFile = $(this).find('span.thefile').attr('data-file')
// $('.photogrid').prepend('<img src="'+TheFile+'">')
// if(TheFile === ThePic.url){
// $(this).remove()
// }
// });
        });
    }
})



  // counter starts at 0
  // Session.setDefault("counter", 0);


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
