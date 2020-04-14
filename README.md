# Project Summary
This project provides the ability to project a team's capacity in a quick manner without the need to create work items.  Work Items can then be generated from the line items as necessary.

## Dev Setup
In order to complete the developer setup steps, it is necessary to create a dev-hub org.  The best way to do this is to create a developer org and then enable the dev-hub feature.  Creating a dev-hub org from the dx signup form will create a trial org that will expire.  Developer orgs do not expire and for this reason are a better option for using dev-hub.

Once you have an org that you would like to use, follow the documentation link to complete the Dev Hub setup.
https://help.salesforce.com/articleView?id=sfdx_setup_enable_devhub.htm&type=5

Once the Dev Hub feature is enabled, create a new scratch org:
`sfdx force:org:create -f ./config/project-scratch-def.json -a `

### Deploy

### Create a New User in Your Scratch Org
Using the Salesforce CLI, execute the following command replacing '[my-unique@username.com]' with a valid value:
`sfdx force:user:create -f ./config/project-user-def.json -a my-user Username=[my-unique@username.com]`

Use the following command to set the new user as the default scratch user (for pushing/pulling changes).  set the defaultusername value to be the same as the newly created user:
`sfdx force:config:set defautlusername=[my-unique@username.com]`

### Prime data
#### Install sfdx-wry-plugin from github

#### Generate Org Specific Data Load Files
Using the files in ./data/orig/, create a set of files with the specific record type ids to use for priming the data.
Excute the following command to generate the files replacing '[your-identifier]' with a valid value (typically the org name):
`sfdx wry:file:replace --json --loglevel debug -i ./data/orig/ -o ./data/[your-dentifier]`

#### Import the Data
Using the Salesforce CLI execute the following command replacing '[your-identifier]' with the same value used to generate the org data files (typically the org name):
`sfdx force:data:tree:import --json --loglevel debug -p ./data/[your-identifier]/agf__ADM_Scrum_Team__c-FN_Project__c-plan.json`