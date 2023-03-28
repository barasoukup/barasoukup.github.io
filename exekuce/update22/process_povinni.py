# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import numpy as np
import pandas as pd

df = pd.read_csv("Open-Data-povinni.csv")

 
#struktura území stažená https://www.czso.cz/csu/czso/i_zakladni_uzemni_ciselniky_na_uzemi_cr_a_klasifikace_cz_nuts
#opravit Praha pou = 10000 a orp = 1000
uzemi = pd.read_excel('struktura_uzemi_cr_1_1_2013_az_1_1_2023.xlsx',sheet_name="1.1.2023", header =[0,1], index_col = 0) 


#pocty
df.loc[df["vekovy_interval"] == "90 a více", 'vekovy_interval'] = "90-95"
df = df[df["exekuci"].notnull()]

#join uzemni jednotky
df = df.merge(uzemi[[
	('Obec s pověřeným obecním úřadem','kód'),
	('Obec s rozšířenou působností','kód'),
	('Okres','kód'),
	('NUTS 3 - Kraj','kód')
	]], how="left",left_on = "kod_obce_zuj", right_index = True) 

df.rename({
	('Obec s pověřeným obecním úřadem', 'kód'):"kod_pou",
	('Obec s rozšířenou působností', 'kód'):"kod_orp",
	('Okres', 'kód'):"kod_okres",
	('NUTS 3 - Kraj', 'kód'):"kod_kraj"
	},axis=1, inplace=True)

uzemni_jednotky = [
	("obce", "kod_obce_zuj"),
	("pou", "kod_pou"),
	("orp", "kod_orp"),
	("okresy", "kod_okres"),
	("kraj", "kod_kraj")]




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

veky_tables = {}

for uj in uzemni_jednotky:

	veky = s_veky.groupby([uj[1],'vekova_skupina']).agg({'exekuci': ['count']})
	veky.reset_index(inplace=True)
	veky.columns=veky.columns.get_level_values(0)
	veky_tables[uj[0]] = pd.pivot_table(veky,index=uj[1], values='exekuci',columns='vekova_skupina', aggfunc="sum")


