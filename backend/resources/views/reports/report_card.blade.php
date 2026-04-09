<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Report Card</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 13px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 22px; }
        .header h3 { margin: 4px 0; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
        th { background: #f0f0f0; }
        .info-grid { display: flex; gap: 20px; margin-bottom: 10px; }
        .info-grid div { flex: 1; }
        .summary { margin-top: 20px; font-size: 14px; }
        .grade-badge { font-weight: bold; font-size: 16px; }
        .pass { color: green; } .fail { color: red; }
    </style>
</head>
<body>
    <div class="header">
        <h1>School Management System</h1>
        <h3>Student Report Card — {{ $exam->name }}</h3>
        <p>{{ $exam->schoolClass->name }} | {{ $exam->start_date }} to {{ $exam->end_date }}</p>
    </div>

    <table style="border:none; margin-bottom:10px;">
        <tr>
            <td style="border:none;"><strong>Name:</strong> {{ $student->user->name }}</td>
            <td style="border:none;"><strong>Admission No:</strong> {{ $student->admission_number }}</td>
        </tr>
        <tr>
            <td style="border:none;"><strong>Class:</strong> {{ $student->schoolClass->name }}</td>
            <td style="border:none;"><strong>Section:</strong> {{ $student->section->name }}</td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Max Marks</th>
                <th>Marks Obtained</th>
                <th>Grade</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach($marks as $i => $mark)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $mark->subject->name }}</td>
                <td>{{ $exam->total_marks }}</td>
                <td>{{ $mark->marks_obtained }}</td>
                <td class="{{ $mark->grade === 'F' ? 'fail' : 'pass' }}">{{ $mark->grade }}</td>
                <td>{{ $mark->remarks ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="3">Total</th>
                <th>{{ $totalObtained }} / {{ $totalMax }}</th>
                <th colspan="2">{{ $percentage }}%</th>
            </tr>
        </tfoot>
    </table>

    <div class="summary">
        <p>Overall Grade: <span class="grade-badge">{{ \App\Models\Mark::calculateGrade($totalObtained, $totalMax) }}</span></p>
        <p>Result: <span class="{{ $percentage >= 40 ? 'pass' : 'fail' }}">{{ $percentage >= 40 ? 'PASS' : 'FAIL' }}</span></p>
    </div>
</body>
</html>
