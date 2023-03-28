# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import numpy as np
import pandas as pd

df = pd.read_csv("Open-Data-povinni.csv")

 #df = pd.read_excel('Open-Data-povinni.xlsx')  

#veky
df.loc[df["vekovy_interval"] == "90 a více", 'vekovy_interval'] = "90-95"

#filtrace chybnych bez poctu exekuci
df = df[df["exekuci"]>0]


s_veky = df[df["vekovy_interval"].str.find("-")>-1]

s_veky[['zacatek_vi','konec_vi']] = s_veky["vekovy_interval"].str.split("-",expand=True).astype(int)
    

# create a list of our conditions
conditions = [
    (s_veky['zacatek_vi'] < 15),
    ((s_veky['zacatek_vi'] >= 15) & (s_veky['zacatek_vi'] < 30)),
    ((s_veky['zacatek_vi'] >= 30) & (s_veky['zacatek_vi'] < 40)),
    ((s_veky['zacatek_vi'] >= 40) & (s_veky['zacatek_vi'] < 50)),
    ((s_veky['zacatek_vi'] >= 50) & (s_veky['zacatek_vi'] < 65)),
    (s_veky['zacatek_vi'] >= 65)
    ]

# create a list of the values we want to assign for each condition
values = ['v0_14', 'v15_29',  'v30_39', 'v40_49', 'v50_64','v65_']

# create a new column and use np.select to assign values to it using our lists as arguments
s_veky['vekova_skupina'] = np.select(conditions, values)

veky = s_veky.groupby(["kod_obce_zuj",'vekova_skupina']).agg({'id': ['count']})
veky.reset_index(inplace=True)
veky.columns=veky.columns.get_level_values(0)
obce_veky = pd.pivot_table(veky,index="kod_obce_zuj", values='id',columns='vekova_skupina', aggfunc="sum")
obce_veky.to_excel("obce_veky.xlsx")
# display updated DataFrame
#df.head()

# pe = počet exekucí
# ppe = pruměrný počet exekucí
# poe = počet osob v exekuci
# cv = celková vymáhaná částka
# mvo = medián vymáhané částky na osobu
# pve = průměrná výše exekuce
# pvo = průměrná výše na osoby


pocty = df.groupby(["kod_obce_zuj"]).agg({'exekuci': ['sum','mean'],
                                                  'id': ['count'],
                                                 'celkova_vymahana_castka':['sum','median'],
                                                 'prumerna_vyse': ['mean']})

pocty.columns = ["pe","ppe","poe","cv","mvo","pve"]
pocty["pvo"] = pocty["cv"] / pocty["poe"]


# vícečetné

conditions = [
    (df['exekuci'] == 1),
    (df['exekuci'] == 2),
    ((df['exekuci'] >= 3) & (df['exekuci'] < 10)),
    ((df['exekuci'] >= 10) & (df['exekuci'] < 30)),
    (df['exekuci'] >= 30)
    ]

values = ['p1', 'p2',  'p3', 'p4', 'p5']

df['pocetni_skupina'] = np.select(conditions, values)
vicecetne = df.groupby(["kod_obce_zuj",'pocetni_skupina']).agg({'id': ['count']})
vicecetne.reset_index(inplace=True)
vicecetne.columns=vicecetne.columns.get_level_values(0)

obce_vicecetne = pd.pivot_table(vicecetne,index="kod_obce_zuj", values='id',columns='pocetni_skupina', aggfunc="sum")




