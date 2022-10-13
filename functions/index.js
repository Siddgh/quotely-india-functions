const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.SendQuoteOfTheWeekNotifications = functions.database.ref('/quote-of-the-week/quoteId').onUpdate(async (change) => {
    const quoteId = change.after.val();
    console.log("Reading Data from Realtime Database Successful : " + quoteId);
    const db = admin.firestore();
    const quotesRef = db.collection('quotes').doc(quoteId);
    const quotesMeta = quotesRef.get().then(async (snapshot) => {
        if(snapshot.exists){
            const quote = snapshot.data().quotes
            const movieName = snapshot.data().movie
            console.log("Quote Obtained " + quote + "From the movie " + movieName);
            const message = {
                notification: {
                    title: "Quote of the Week",
                    body: quote + "\n\n~ " + movieName
                },
                topic: 'notification'
            };
            let response = await admin.messaging().send(message);
            console.log("Notification Successfully Sent")
            console.log("Response -> " + response)
            return null
        }else{
            console.log("Document not found for Id -> " + quoteId);
            return null
        }
    }).catch(err =>{
        console.log("Error while fetching the document from Firestore " + err);
    });

});