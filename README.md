# sherab.org

Purpose
*******

This README provides setup instructions, basic commands, and operational details for managing sherab.org which is based on Open edX platform using Tutor.

The `sherab.org <https://sherab.org)>`_ is a service-oriented platform for authoring and
delivering online learning at any scale.  The platform is written in
Python and JavaScript and makes extensive use of the Django
framework. At the highest level, the platform is composed of a
monolith, some independently deployable applications (IDAs), and
micro-frontends (MFEs) based on the ReactJS.

This repository hosts the monolith at the center which is derived from the Open edX
platform.  Functionally, the sherab.org repository provides two services:

* CMS (Content Management Service), which powers Open WeBuddhist Academy Studio, the platform's learning content authoring environment; and
* LMS (Learning Management Service), which delivers learning content.

Getting Started
***************

Prerequisites
==============

Minimum System Configuration
----------------------------
Ports 80 and 443 should be open. If other web services run on these ports, setup a web proxy.

Hardware:
---------

* Minimum configuration: 4 GB RAM, 2 CPU, 8 GB disk space

* Recommended configuration: 8 GB RAM, 4 CPU, 25 GB disk space

Software:
---------

* Docker (latest version recommended)

* Docker Compose

* Python 3.8+

* pip or pip3

* Tutor (Palm, version 16)

* MySQL (latest vesrsion recommended)

To install Tutor:
-----------------
Download `Docker <https://docs.docker.com/engine/install/>`_ according to the system OS
Download `Docker Compose <https://docs.docker.com/compose/install/>`_ according to the system OS
pip install ‘tutor[full]>=16.0.0,<17.0.0’

Setting Up the Project:
----------------------
Initialize Tutor/ Start all required services:

* tutor local launch # for local installations
  
* tutor dev launch   # for local development installations
  
* tutor k8s launch   # for Kubernetes installation


Configuration (Optional but recommended):
If you run customised Docker images, you need to rebuild them before running launch:

* tutor config save

* tutor images build all # specify here the images that you need to build
  
* tutor local launch

To stop running services:

* tutor local stop

Restarting Services:

* tutor local restart

Running Individual Services:
----------------------------

You can start specific services as needed. Example:

* tutor local start lms

Accessing Open edX:
-------------------

Once started, you can access Open edX at:

* LMS: http://localhost

* Studio (CMS): http://studio.localhost

To create an admin user:

tutor local createuser --staff --superuser admin admin@example.com

Running Migrations:
-------------------

If you make changes to the database, run migrations:

* tutor local run lms ./manage.py migrate

Viewing Logs:
-------------

To see logs for all services:

* tutor local logs -f

To see logs for a specific service, such as lms:

* tutor local logs -f lms

Updating Open edX:
------------------

To update to a new version of Open edX:

* pip install --upgrade tutor-openedx

* tutor local upgrade

Backup and Restore:
-------------------

To back up your data:

* tutor local dump

To restore from a backup:

* tutor local import ./backup.tar.gz

Cloning sherab.org Repo into Tutor:
-----------------------------------

* navigate into '.local/share/tutor/env/build/openedx/themes' for windows and clone

* navigate into '/Users/localuser/Library/Application Support/tutor/env/build/openedx/' for Macos and clone

Command for setting theme as sherab.org:
----------------------------------------

* tutor local do settheme sherab-theme/(your cloned folder name)

Additional Resources:
---------------------

Tutor Documentation: https://docs.tutor.edly.io/

Open edX Community: https://open.edx.org/community/
