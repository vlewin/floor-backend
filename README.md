# staff-backend
JSON API server for SUSE Employee Directory (staff.suse.de) 

Create a `config.json` file in the root directory and add SUSE and Novell LDAP servers  
```json
{ 
  "suse_ldap_server":"ldap://<FQDN>:<PORT>", 
  "novell_ldap_server":"<FQDN>:<PORT>" 
}
```


run `sudo npm install` to install the dependencies  
run `forever -d -w server.js` to start server

