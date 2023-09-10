#!/usr/bin/python
import ast
import json
import threading
import sys
import datetime
# import coloredlogs
import requests
import re
import os
import logging
import xlrd
from datetime import datetime
from collections import OrderedDict
from argparse import ArgumentParser, RawTextHelpFormatter
from xlrd import open_workbook

script_name = os.path.basename(__file__)  # script name
script_path = os.path.realpath(__file__)  # script
# coloredlogs.install()                    # color for logging module output
logger = logging.getLogger('example_logger')  # create logger
# logger = logging.getLogger(script_name)  # create logger


# ------------------ #
# Creating json file
# ------------------ #


def createJsonFile(json_data, file_n, path):
    file_n = ''.join(file_n).rsplit(".", 1)[0]
    file_new = ''.join(file_n).rsplit("/", 1)[1:]  # if not file_n is None
    if len(file_new) != 0:
        file_n = file_new

    if not os.path.exists(path):
        os.makedirs(path)

    # Here using .join() added Model_Name with .json
    with open(''.join(path) + '/' + ''.join(file_n)+'.json', 'w') as f:
        f.write(json_data)
        f.close()
    logger.warning(
        "Successfully created the {{%s}}.json file into the {{%s}} path.....", file_n, path)


def readJsonFile(file_n, path):
    file_n = ''.join(file_n).rsplit(".", 1)[0]
    file_new = ''.join(file_n).rsplit("/", 1)[1:]  # if not file_n is None
    if len(file_new) != 0:
        file_n = file_new
    with open(''.join(path) + '/' + ''.join(file_n)+'.json') as f:
        json_data = json.load(f, object_pairs_hook=OrderedDict)
    return json_data


def readByXlrd(excel_name):
    """
    : This function take excel file name as string and return the file data
    : This will read the excel file using xlrd module & return it
    : workbook : a variable to save the excel data
    """
    workbook = open_workbook(file_contents=excel_name["filename"].read())
    return workbook


def email_check(email):
    regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    if(re.search(regex, email)):
        return True
    else:
        return False


def excel2json(sheet, key_list, DATA_DIC, INDEX):
    """
    run function of the json_vams_class
    This function will read the XLS file and create a JSON data from the XLS file
    : function listDic : This will return list
    : parameter xlsbook : This will hold the whole XLS file data here
    : parameter sheet_index : This hold the index no. of the XLS sheet
    : parameter sheet : This will hold the individual sheet no. data
    : parameter data_dic : Save all the list into a dictionary
    : parameter data_list : Save port info into a list

    """
    row_length = sheet.nrows
    col_length = sheet.ncols
    for row in range(1, row_length):
        data_dic = OrderedDict()
        for col in range(0, col_length):
            try:
                cell_value = sheet.cell_value(rowx=row, colx=col).strip()
                cell_value = re.sub(r'\s+', ' ', cell_value)
            except:
                cell_value = sheet.cell_value(rowx=row, colx=col)
            if key_list[col] == "ID":
                data_dic["employee_id"] = int(float(cell_value))
            elif key_list[col] == "Full Name":
                try:
                    data_dic["first_name"] = cell_value.rsplit(' ', 1)[0]
                    data_dic["last_name"] = cell_value.rsplit(' ', 1)[1]
                except:
                    data_dic["first_name"] = cell_value
                    data_dic["last_name"] = cell_value
            elif key_list[col] == "Email":
                email_checking = email_check(cell_value)
                if email_checking == True:
                    data_dic["email"] = cell_value
                else:
                    logger.error(
                        " Invalid email found in {%s} no excel sheet's {row = %s, col = %s}.", INDEX+1, row+1, col+1)
                    sys.exit()
            elif key_list[col] == "Designation":
                data_dic["dsg"] = cell_value
            elif key_list[col] == "Department":
                data_dic["group"] = cell_value
            elif key_list[col] == "Reports To":
                try:
                    data_dic["reports_to"] = int(float(cell_value))
                except:
                    data_dic["reports_to"] = cell_value
            else:
                logger.error(
                    " Invalid column value found in {%s} no excel sheet's {row = %s, col = %s}.", INDEX+1, row+1, col+1)
                # sys.exit()
        DATA_DIC.append(data_dic)
    return DATA_DIC


def checkingAndCreateJson(workbook, INDEX, DATA_DIC):
    try:
        sheet = workbook.sheet_by_index(INDEX)
    except:
        logger.error("Couldn't find the sheet no of the excel file")
        sys.exit()
    key_list = []
    key_col = ["ID", "Full Name", "Email",
               "Designation",  "Department", "Reports To"]
    key_length = sheet.ncols
    for i in range(0, key_length):
        cell_value = sheet.cell_value(rowx=0, colx=i)
        cell_value = re.sub(r"\s+", " ", cell_value)
        cell_value = re.sub(r"\s\?", "?", cell_value)
        key_list.append(cell_value)
    key_length = len(key_col)
    for item in key_col:
        if item not in key_list:
            logger.error(
                " Couldn't find {%s} column in {%s} no excel sheet.", item, INDEX+1)
            # sys.exit()
    DATA_DIC = excel2json(sheet, key_list, DATA_DIC, INDEX)
    return DATA_DIC


class excel2jsonClass(threading.Thread):
    """

    """

    def __init__(self, EXCEL_FILE, INDEX):
        threading.Thread.__init__(self)
        self.EXCEL_FILE = EXCEL_FILE
        self.INDEX = INDEX

    def run(self):
        """

        """
        logger.warning(
            "\x1b[92mStartiung to create the database from {{%s}} file.....", self.EXCEL_FILE)
        workbook = readByXlrd(self.EXCEL_FILE)
        DATA_DIC = []
        if self.INDEX == 0:
            logger.error("Couldn't find the sheet no of the excel file")
            # sys.exit()
        if self.INDEX != "all":
            DATA_DIC = (checkingAndCreateJson(
                workbook, self.INDEX-1, DATA_DIC))
        else:
            workbook_len = workbook.nsheets
            for i in range(0, workbook_len):
                DATA_DIC = (checkingAndCreateJson(workbook, i, DATA_DIC))
        return DATA_DIC
