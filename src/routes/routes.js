const {Router} = require('express')
const router = Router()
const firebase = require('firebase') 
const firebaseConfig = require('../firebase/config')
const dbFirebase = require('../firebase/db')

firebase.initializeApp(firebaseConfig)

router
        .post('/login', (req, res) =>{
         
              const {mail,pass} = req.body
              console.log(mail,pass)

              firebase.auth().signInWithEmailAndPassword(mail, pass).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code
                var errorMessage = error.message
              })
              firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  // User is signed in.
                  var displayName = user.displayName
                  var email = user.email
                  var emailVerified = user.emailVerified
                  var photoURL = user.photoURL
                  var isAnonymous = user.isAnonymous
                  var uid = user.uid
                  var providerData = user.providerData
                  console.log(uid)
                  res.status(200).json({"Id user":uid})
                } else {
                  res.status(500).json({message:"User incorrect"})
                }
              })
        })

                  
        .post('/sites', async (req, res) => {
          let nameSites = dbFirebase.collection('SitiosInteres').doc()
          const {detalle, nombre} = req.body

          let newSites = await nameSites.set({
            'detalle': detalle,
            'nombre': nombre

          })
          console.log(newSites)
          res.status(200).json({message:"Sitio creado"})
        })


        .get('/sites', (req, res) => {
          dbFirebase.collection('SitiosInteres').get()
          .then((snapshot) => {
            let arrayData = []
            snapshot.forEach((doc) => {
              console.log(doc.id, '=>', doc.data())
              arrayData.push({id:doc.id,nombre: doc.data().nombre})
            })
            res.status(200).json(arrayData)
          })
          .catch((err) => {
            console.log('Error getting documents', err)
          })
        })
        

        .get('/sites/name/:nombre', (req, res) => {
          const {nombre} = req.params
          dbFirebase.collection('SitiosInteres').get()
          .then((snapshot) => {
            let arrayData = []
            snapshot.forEach((doc) => {            
              if (doc.data().nombre == nombre) {
                arrayData.push(doc.data().nombre, doc.data().detalle)
                res.status(200).json(arrayData)
                return
              } 
            }) 
            res.status(500).json({message:"Nombre no existe"})           
          })
          .catch((err) => {
            console.log('Error getting documents', err)
          })
        })


        .get('/sites/:id', (req, res) => {
          const {id} = req.params
          dbFirebase.collection('SitiosInteres').get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              if (doc.id == id) {
                res.status(200).json({
                "nombre": doc.data().nombre,
                "detalle": doc.data().detalle
                })
                return
              }
            })
            res.status(500).json({message:"Id no existe"})
          })
          .catch((err) => {
            console.log('Error getting documents', err)
          })
        })

        .delete('/sites/:id', (req, res) => {
          try {
            const {id} = req.params
          dbFirebase.collection('SitiosInteres').doc(id).delete()
          res.status(200).json({"Id": id,message:"Eliminado"})
          } catch (error) {
            console.log(error)
          }
        })

        .put('/sites/:id', async (req, res) => {
          try {
            const {id} = req.params
            const {detalle, nombre} = req.body

            const cityRef = dbFirebase.collection('SitiosInteres').doc(id)
            await cityRef.update({
              detalle : detalle,
              nombre: nombre
            })
            res.status(200).json({"Id": id, message :"Recurso editado"})

          } catch (error) {
            console.log('Error getting documents', err)
          }
        })
        




module.exports = router