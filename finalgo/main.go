package main

import (
    "context"
    "fmt"
    "log"
	"html/template"
	"net/http"
    // "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

// You will be using this Trainer type later in the program
type Suggest struct {
    Name string
	Email string
	Suggestion string
}



func main() {
	// Rest of the code will go here
	// Set client options
	fmt.Println("Go Server is listening on 3000")
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}
	collection := client.Database("test").Collection("suggest")
	fmt.Println("Connected to MongoDB!")


	// //TO INSERT A SINGLE DOCUMENT
	// ash := Suggest{"Ash", "shashank@gmail.com", "Nice one"}
	// insertResult, err := collection.InsertOne(context.TODO(), ash)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// fmt.Println("Inserted a single document: ", insertResult.InsertedID)

	// //TO INSERT MULTIPLE DOCUMENTS

	// misty := Suggest{"Misty", "abc@gmail.com", "Cerulean City"}
	// brock := Suggest{"Brock", "bcd@gmail.com", "Pewter City"}

	// trainers := []interface{}{misty, brock}

	// insertManyResult, err := collection.InsertMany(context.TODO(), trainers)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// fmt.Println("Inserted multiple documents: ", insertManyResult.InsertedIDs)

	//TO RENDER THE FORM
	tmpl := template.Must(template.ParseFiles("form.html"))

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
            tmpl.Execute(w, nil)
            return
        }

        details := Suggest{
            Name:   r.FormValue("name"),
            Email: r.FormValue("email"),
            Suggestion: r.FormValue("suggestion"),
        }

        // do something with details
        insertResult, err := collection.InsertOne(context.TODO(), details)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println("Inserted a single document: ", insertResult.InsertedID)

        tmpl.Execute(w, struct{ Success bool }{true})
    })

    	http.ListenAndServe(":3000", nil)

}