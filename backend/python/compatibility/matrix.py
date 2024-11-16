def calculate_matrix(participants):
    n = len(participants)
    matrix = [[0.0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        for j in range(n):
            if i != j:
                matrix[i][j] = calculate_compatibility(participants[i], participants[j])

    return matrix

def calculate_compatibility(person1, person2):
    traits1 = set(person1.get("traits", []))
    traits2 = set(person2.get("traits", []))
    intersection = traits1.intersection(traits2)
    union = traits1.union(traits2)
    return len(intersection) / len(union) if union else 0.0
