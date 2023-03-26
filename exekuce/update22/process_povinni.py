# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import numpy as np
import pandas as pd

df = pd.read_excel('Open-Data-povinni.xlsx')  

#pocty


# create a list of our conditions
conditions = [
    (df['zacatek_vi'] < 20),
    ((df['zacatek_vi'] >= 20) & (df['zacatek_vi'] < 65)),
    (df['zacatek_vi'] >= 65)
    ]

# create a list of the values we want to assign for each condition
values = ['deti', 'produktivni', 'duchodci']

# create a new column and use np.select to assign values to it using our lists as arguments
df['vekova_skupina'] = np.select(conditions, values)

veky = df.groupby(["kod_obce_zuj",'vekova_skupina']).agg({'exekuci': ['count']})
veky.reset_index(inplace=True)
veky.columns=veky.columns.get_level_values(0)
obce_veky = pd.pivot_table(veky,index="kod_obce_zuj", values='exekuci',columns='vekova_skupina', aggfunc="sum")
obce_veky.to_excel("obce_veky.xlsx")
# display updated DataFrame
#df.head()

