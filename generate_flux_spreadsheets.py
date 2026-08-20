import pandas as pd
import json
import os
import glob
import sys
from pathlib import Path

# Force UTF-8 encoding for stdout on Windows
sys.stdout.reconfigure(encoding='utf-8')

def convert_json_to_excel():
    print("Iniciando conversao dos arquivos JSON do Flux para Excel (XLSX)...")
    
    input_dir = "C:/CLAUDE-TESTE/seed_data_flux"
    output_dir = "C:/CLAUDE-TESTE/seed_data_flux_excel"
    
    os.makedirs(output_dir, exist_ok=True)
    
    json_files = glob.glob(f"{input_dir}/*.json")
    
    if not json_files:
        print("Nenhum arquivo JSON encontrado!")
        return
        
    for json_file in json_files:
        filename = Path(json_file).stem
        excel_file = f"{output_dir}/{filename}.xlsx"
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            if not data:
                print(f"Aviso: {filename}.json esta vazio")
                continue
                
            df = pd.DataFrame(data)
            
            writer = pd.ExcelWriter(excel_file, engine='xlsxwriter')
            sheet_name = filename[:31]
            df.to_excel(writer, index=False, sheet_name=sheet_name)
            
            workbook = writer.book
            worksheet = writer.sheets[sheet_name]
            
            header_format = workbook.add_format({
                'bold': True,
                'bg_color': '#0f172a',
                'font_color': 'white',
                'border': 1
            })
            
            for col_num, value in enumerate(df.columns.values):
                worksheet.write(0, col_num, value, header_format)
                
                # Fix for the "float has no len()" error
                # We handle the NaNs/floats by converting everything to string first
                max_len = 0
                for item in df[value]:
                    if pd.notna(item):
                        item_len = len(str(item))
                        if item_len > max_len:
                            max_len = item_len
                            
                column_len = max(max_len, len(str(value))) + 2
                column_len = min(column_len, 50)
                worksheet.set_column(col_num, col_num, column_len)
                
            writer.close()
            print(f"[OK] Convertido: {filename}.xlsx ({len(data)} registros)")
            
        except Exception as e:
            print(f"[ERRO] Falha ao converter {filename}: {str(e)}")

    print(f"\nFinalizado! Todos os arquivos foram salvos na pasta {output_dir}")

if __name__ == "__main__":
    convert_json_to_excel()
