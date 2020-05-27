# Project Summary
This project provides the ability to project a team's capacity in a quick manner without the need to create work items.  Work Items can then be generated from the line items as necessary.

## Dev Setup
In order to complete the developer setup steps, it is necessary to create a dev-hub org.  The best way to do this is to create a developer org and then enable the dev-hub feature.  Creating a dev-hub org from the dx signup form will create a trial org that will expire.  Developer orgs do not expire and for this reason are a better option for using dev-hub.

Once you have an org that you would like to use, follow the documentation link to complete the Dev Hub setup.
https://help.salesforce.com/articleView?id=sfdx_setup_enable_devhub.htm&type=5

Once the Dev Hub feature is enabled, create a new scratch org replacing 'your-alias' with your value of choice.
```console
sfdx force:org:create -f config/project-scratch-def.json -a [your-alias] -d 30 -s --loglevel debug --json
```

### Deploy
#### Install dependencies
Install the dependencies found in the fifty-ninety-dependencies repo.  Use the scratch org created above to install the dependencies.

#### Deploy the source code
Deploy the code using sfdx once the dependencies have been installed.
```console
sfdx force:source:push
```

#### Assign Permissions to the User
Assign the admin permission set to your user so that the user has read/write access to the objects and fields.
```console
sfdx force:user:permset:assign -n fn_fiftyNinetyProjectAdmin
```

### Prime the Data
#### Install sfdx-wry-plugin from github
At the time of this document, there is an issue with installing the plugin and the commands not being recognized. To resolve this, follow the listed steps to install and link the source code.
1. Clone the repo
    ```console
    git clone https://github.com/billryoung/sfdx-wry-plugin.git
    ```
2. Link the plugin source code to sfdx
    ```console
    sfdx plugins:link sfdx-wry-plugin
    ```

#### Generate Org Specific Data Load Files
Using the files in ./data/orig/, create a set of files with the specific record type ids to use for priming the data.
Excute the following command to generate the files replacing '[your-identifier]' with a valid value (typically the org name):
```console
sfdx wry:file:replace --json --loglevel debug -i ./data/orig/ -o ./data/[your-dentifier]
```

#### Import the Data
Using the Salesforce CLI execute the following command replacing '[your-identifier]' with the same value used to generate the org data files (typically the org name):
```console
sfdx force:data:tree:import --json --loglevel debug -p ./data/[your-identifier]/fn-data-plan.json
```