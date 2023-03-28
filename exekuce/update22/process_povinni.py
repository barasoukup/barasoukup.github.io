# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import numpy as np
import pandas as pd
import json



#obce počty obyvatel z https://www.czso.cz/csu/czso/databaze-mos-otevrena-data

df = pd.read_csv('mos_data_2021.csv')

df = df[df["kodukaz"].isin([110940,110950,110970,110980,110990])]
df['value']=df["hodnota "].astype('int')
obce_obyv = df.groupby(['koduzemi']).agg({'value': ['sum']})

df = pd.read_csv("Open-Data-povinni.csv")

#kod roku
R = 2 
#struktura území stažená https://www.czso.cz/csu/czso/i_zakladni_uzemni_ciselniky_na_uzemi_cr_a_klasifikace_cz_nuts
#opravit Praha pou = 10000 a orp = 1000
uzemi = pd.read_excel('struktura_uzemi_cr_1_1_2013_az_1_1_2023.xlsx',sheet_name="1.1.2023", header =[0,1], index_col = 0) 

uzemi = uzemi.join(obce_obyv,how="left")
uzemi = uzemi[[
    ('Obec s pověřeným obecním úřadem','kód'),
	('Obec s rozšířenou působností','kód'),
	('Okres','kód'),
	('NUTS 3 - Kraj','kód'),
    ('value','sum')]]

uzemi.columns = ["kod_pou","kod_orp","kod_okres", "kod_kraj" ,"o"]
obyv_agg = {}
obyv_agg["obce"] = uzemi[["o"]]
obyv_agg["obce"].columns=obyv_agg["obce"].columns.get_level_values(0)
obyv_agg["pou"] = uzemi.groupby([('kod_pou')]).agg({'o': ['sum']})
obyv_agg["pou"].columns=obyv_agg["pou"].columns.get_level_values(0)
obyv_agg["orp"] = uzemi.groupby([('kod_orp')]).agg({'o': ['sum']})
obyv_agg["orp"].columns=obyv_agg["orp"].columns.get_level_values(0)
obyv_agg["okresy"] = uzemi.groupby([('kod_okres')]).agg({'o': ['sum']})
obyv_agg["okresy"].columns=obyv_agg["okresy"].columns.get_level_values(0)
obyv_agg["kraje"] = uzemi.groupby([('kod_kraj')]).agg({'o': ['sum']})
obyv_agg["kraje"].columns=obyv_agg["kraje"].columns.get_level_values(0)

#pocty
df.loc[df["vekovy_interval"] == "90 a více", 'vekovy_interval'] = "90-95"

#filtrace chybnych bez poctu exekuci
df = df[df["exekuci"]>0]

#join uzemni jednotky
df = df.merge(uzemi[["kod_pou","kod_orp","kod_okres", "kod_kraj"]], how="left",left_on = "kod_obce_zuj", right_index = True) 


uzemni_jednotky = [
	("obce", "kod_obce_zuj",["obce.geojson"]),
	("pou", "kod_pou",[]),
	("orp", "kod_orp",["orp.geojson"]),
	("okresy", "kod_okres", ["okresy.geojson"]),
	("kraje", "kod_kraj", ["kraje.geojson","kraje_en.geojson"])]




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


for uj in uzemni_jednotky:
    print(uj[0])

    veky = s_veky.groupby([uj[1],'vekova_skupina']).agg({'exekuci': ['count']})
    veky.reset_index(inplace=True)
    veky.columns=veky.columns.get_level_values(0)
    veky_table = pd.pivot_table(veky,index=uj[1], values='exekuci',columns='vekova_skupina', aggfunc="sum")
    
    # pe = počet exekucí
    # ppe = pruměrný počet exekucí
    # poe = počet osob v exekuci
    # cv = celková vymáhaná částka
    # mvo = medián vymáhané částky na osobu
    # pve = průměrná výše exekuce
    # pvo = průměrná výše na osoby
    pocty = df.groupby([uj[1]]).agg({'exekuci': ['sum','mean'],
                                                  'id': ['count'],
                                                 'celkova_vymahana_castka':['sum','median'],
                                                 'prumerna_vyse': ['mean']})

    pocty.columns = ["pe","ppe","poe","cv","mvo","pve"]
    pocty["pvo"] = pocty["cv"] / pocty["poe"]



    vicecetne = df.groupby([uj[1],'pocetni_skupina']).agg({'id': ['count']})
    vicecetne.reset_index(inplace=True)
    vicecetne.columns=vicecetne.columns.get_level_values(0)

    vicecetne_table = pd.pivot_table(vicecetne,index=uj[1], values='id',columns='pocetni_skupina', aggfunc="sum")

    celek_table = pocty.merge(veky_table,right_index=True, left_index=True).merge(vicecetne_table,right_index=True, left_index=True)
    if uj[0] in ("orp",'okresy','kraje'):
        celek_table= celek_table.join(obyv_agg[uj[0]])
        celek_table["podil_oe"] = celek_table["poe"] / celek_table["o"] 
        celek_table["podil_oe_rank"] = celek_table["podil_oe"].rank()
    
    # celek_table.to_excel(uj[0]+".xlsx")  
    # for f in uj[2]:
    #     with open(f,encoding="utf-8") as file:
    #         data = json.load(file)
    #     features = data["features"]
    #     for feature in features:
    #         props = feature["properties"]
    #         i = props['i']
    #         props['pe'+R] = celek_table.loc[i]['pe']
            
        
        
