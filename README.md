## hackernews clone

### Stack
* Typescript
* Graphql
* Apollo-server
* Prisma
* Sqlite

### Configuration
* Install all the dependencies
  ```shell
  npm i
  ```
* Migrate the database with prisma
  ```shell
  npm run migrate
  ```
* Generate prisma client and types
  ```shell
  npm run generate
  ```
  
### Usage
* Start the dev server
  ```shell
  cd server
  npm run dev
  ```
* Go to `http://localhost:4000`

### Examples
#### Mutation
* Signup
  ```graphql
  mutation {
    signup(email: "at@email.com", password: "aw3some", name: "at") {
      token
      user {
        name
        email
      }
    }
  }
  ```
* Login
  ```graphql
  mutation {
    login(email: "at@email.com", password: "aw3some") {
      token
      user {
        name
        email
      }
    }
  }
  ```
* Change name
  ```graphql
  mutation {
    cahngeName(name: "Aldo") {
      id
      name
    }
  }
  ```
  * Headers
    ```graphql   
    {
      "Authorization": "Bearer YOUR_TOKEN"
    }
    ```
* Post a Link
  ```graphql
  mutation {
    post(url: "www.github.com/aldotestino", description: "my GitHub page") {
      id
      url
      description
    }
  }
  ```
  * Headers
    ```graphql   
    {
      "Authorization": "Bearer YOUR_TOKEN"
    }
    ```
* Delete a Link
  ```graphql
  mutation {
    deleteLink(id: "3") {
      id
      url
      description
    }
  }
  ```
  * Headers
    ```graphql   
    {
      "Authorization": "Bearer YOUR_TOKEN"
    }
    ```
* Vote a Link
  ```graphql
  mutation {
    vote(linkId: "3") {
      id
      link {
        url
      }
      user {
        name
      }
    }
  }
  ```
  * Headers
    ```graphql   
    {
      "Authorization": "Bearer YOUR_TOKEN"
    }
    ```

#### Query
* Get all the Links
  ```graphql
  query {
    feed {
      url
      description
      postedBy {
        name
      } 
    }
  }
  ```
  * Params:
    * filter
    * skip
    * take
    * orderBy
      * createdAt
      * url
      * description
* Get a Link
  ```graphql
  query {
    link(id: "3") {
      url
      description
      postedBy {
        name
      } 
    }
  }
  ```
* Get all the Users
  ```graphql
  query {
    users {
      name
      email
      links {
        url
        description
      } 
    }
  }
  ```
    * Params:
    * filter
    * skip
    * take
    * orderBy
      * name
      * email
* Get a User
  ```graphql
  query {
    user(id: "1") {
      name
      email
      links {
        url
        description
      } 
    }
  }
  ```

#### Subscription
* Subscribe to new links
  ```graphql
  subscription newLink {
    id
    url
    description
    postedBy {
      name
    }
  }
  ```
  * Headers
    ```graphql   
    {
      "Authorization": "Bearer YOUR_TOKEN"
    }
    ```
* Subscribe to new votes
  ```graphql
  subscription newVote {
    id
    link {
      id
      url
      description
      postedBy {
        name
      }
    }
    user {
      id
      name
    }
  }
  ```
  * Headers
    ```graphql   
    {
      "Authorization": "Bearer YOUR_TOKEN"
    }
    ```
